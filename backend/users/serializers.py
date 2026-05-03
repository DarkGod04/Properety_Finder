from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_str, smart_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.urls import reverse
from django.conf import settings
# DRF
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
# JWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
# LOCAL
from .models import  CustomUser, BuyerProfile, AdminProfile, DeveloperProfile,BrokerProfile,AgentProfile,UserOTP, JoinRequest
from .utils import send_normal_email





############################ Register USER  - contain validation - contain buyer profiles data ###########################
### (Register a new user +  send OTP to email) - for any type or roles :  buyer - developer - broker - agent  ###########

class RegisteUserProfileSerializer(serializers.ModelSerializer):
    email          = serializers.EmailField(max_length=None, min_length=None, allow_blank=False)
    first_name     = serializers.CharField(max_length=12, min_length=3, allow_blank=False, trim_whitespace=True)
    last_name      = serializers.CharField(max_length=12, min_length=3, allow_blank=False, trim_whitespace=True)
    password       = serializers.CharField(max_length=68, min_length=6, write_only=True)
    password2      = serializers.CharField(max_length=68, min_length=6, write_only=True)
    token          = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    # profiles 
    admin_profile  = serializers.SerializerMethodField()
    buyer_profile  = serializers.SerializerMethodField()
    developer_profile = serializers.SerializerMethodField()
    broker_profile = serializers.SerializerMethodField()
    agent_profile = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'password', 'password2',
            'role', 'token',   # 👈 keep role here so frontend can send it
             'admin_profile','buyer_profile', 'developer_profile','broker_profile','agent_profile', 'is_verifiedEmail', 'is_active', 'is_staff',
            'is_superuser'     
        ]
        extra_kwargs = {
            'password' : {'write_only': True},
            'password2': {'write_only': True},
        }
        read_only_fields = [
            'id', 'is_verifiedEmail','is_superuser', 'is_active', 'is_staff',
            'admin_profile', 'buyer_profile','developer_profile','broker_profile','agent_profile'     
        ]
    
   
    def validate(self, attrs):
        print('Validating data:', attrs)
        password  = attrs.get('password')
        password2 = attrs.get('password2')
        role = attrs.get('role', CustomUser.RoleType.BUYER)
        token = attrs.get('token')

        # Check if passwords match
        if password != password2:
            raise serializers.ValidationError("Passwords do not match")
            
        # Check token for restricted roles
        if role in [CustomUser.RoleType.DEVELOPER, CustomUser.RoleType.BROKER, CustomUser.RoleType.AGENT]:
            if not token:
                raise serializers.ValidationError({"token": "A valid registration token is required for this role."})
            try:
                join_request = JoinRequest.objects.get(token=token, status=JoinRequest.StatusType.APPROVED, role_requested=role)
                if join_request.email != attrs.get('email'):
                    raise serializers.ValidationError({"email": "This email does not match the approved join request."})
            except JoinRequest.DoesNotExist:
                raise serializers.ValidationError({"token": "Invalid or expired registration token."})

        return attrs


    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("The Email field is required.")
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value
        

    def validate_first_name(self, value):
        """
        Validate that the first_name is not empty.
        """
        if not value:
            raise serializers.ValidationError("The First Name field is required")
        return value


    def validate_last_name(self, value):
        """
        Validate that the last_name is not empty.
        """
        if not value:
            raise serializers.ValidationError("The Last Name field is required")
        return value
     
     
    def create(self, validated_data):
        print('Creating user with validated_data=', validated_data)
        valid_admin_profile_data     = validated_data.pop('admin_profile', None)
        valid_buyer_profile_data     = validated_data.pop('buyer_profile', None)
        valid_developer_profile_data = validated_data.pop('developer_profile', None)
        valid_broker_profile_data    = validated_data.pop('broker_profile', None)
        valid_agent_profile_data     = validated_data.pop('agent_profile', None)
        
        # 👇 use role from validated_data (default = buyer if not sent)
        role = validated_data.get('role', CustomUser.RoleType.BUYER)
        
        user = CustomUser.objects.create_user(
                        email      = validated_data['email'],
                        password   = validated_data['password'],
                        first_name = validated_data['first_name'],
                        last_name  = validated_data['last_name'],
                        role       = validated_data.get('role', CustomUser.RoleType.BUYER)  # 👈 come from frontend register page
        )
        print("user=",user)
        if valid_admin_profile_data:
            if user.role == "admin":
                AdminProfile.objects.create(user=user, **valid_admin_profile_data)
        
        if valid_buyer_profile_data:
            if user.role == "buyer":
                BuyerProfile.objects.create(user=user, **valid_buyer_profile_data)
        
        if valid_developer_profile_data:
            if user.role == "developer":
                DeveloperProfile.objects.create(user=user, **valid_developer_profile_data)
        
        if valid_broker_profile_data:
            if user.role == "broker":
                BrokerProfile.objects.create(user=user, **valid_broker_profile_data)
        
        if valid_agent_profile_data:
            if user.role == "agent":
                AgentProfile.objects.create(user=user, **valid_agent_profile_data)
     
        return user


    def get_admin_profile(self, obj):
        # user object only has attribute 'admin_profile' if the user is an admin
        if obj.role == "admin" and hasattr(obj, 'admin_profile'):
            try:
                ap = obj.admin_profile
                return AdminProfileSerializer(ap).data
            except AdminProfile.DoesNotExist:
                return None
        return None
    

    def get_buyer_profile(self, obj):
         # user object only has attribute 'buyer_profile' if the user is a buyer
        if obj.role == "buyer" and hasattr(obj, 'buyer_profile'):
            try:
                cp = obj.buyer_profile
                return BuyerProfileSerializer(cp).data
            except BuyerProfile.DoesNotExist:
                return None
        return None
    
    def get_developer_profile(self, obj):
         # user object only has attribute 'developer_profile' if the user is a developer
        if obj.role == "developer" and hasattr(obj, 'developer_profile'):
            try:
                cp = obj.developer_profile
                return DeveloperProfileSerializer(cp).data
            except DeveloperProfile.DoesNotExist:
                return None
        return None 
    
            
    def get_broker_profile(self, obj):
         # user object only has attribute 'broker_profile' if the user is a broker
        if obj.role == "broker" and hasattr(obj,'broker_profile'):
            try:
                cp = obj.broker_profile
                return BrokerProfileSerializer(cp).data
            except BrokerProfile.DoesNotExist:
                return None
        return None 
        
   
    def get_agent_profile(self, obj):
         # user object only has attribute 'agent_profile' if the user is a agent
        if obj.role == "agent" and hasattr(obj,'agent_profile'):
            try:
                cp = obj.agent_profile
                return AgentProfileSerializer(cp).data
            except AgentProfile.DoesNotExist:
                return None
        return None 
    
    
    
    def to_representation(self, instance):
        """
        Override the to_representation method to exclude admin_profile if it is None.
        """
        representation = super().to_representation(instance)
        if representation['admin_profile'] is None:
            representation.pop('admin_profile')  # Remove admin_profile from the response
        if representation['buyer_profile'] is None:
            representation.pop('buyer_profile')  # Remove buyer_profile from the response
        if representation['developer_profile'] is None:
            representation.pop('developer_profile')  # Remove developer_profile from the response
        if representation['broker_profile'] is None:
            representation.pop('broker_profile')  # Remove broker_profile from the response
        if representation['agent_profile'] is None:
            representation.pop('agent_profile')  # Remove agent_profile from the response
        return representation
    
     






########################### Confirm Email BY LINK ###########################
# class ConfirmUserEmailSerializer(serializers.ModelSerializer):
#     token  = serializers.CharField(min_length=1, write_only=True)
#     uidb64 = serializers.CharField(min_length=1, write_only=True)

#     class Meta:
#         model = CustomUser
#         fields = ['token', 'uidb64']
        
   
   
        
        
        
        
 
# login


class LoginUserSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # email = data.get('email')
        # password = data.get('password')
        # request = self.context.get('request')

        # print("Login attempt:", email)

        user = authenticate(**data) # <-- This calls your backend automatically
        print("LoginUserSerializer user:", user)

        if not user:
            raise serializers.ValidationError("Incorrect credentials.")
        if not user.is_verifiedEmail:
            raise serializers.ValidationError("Email is not verified.")
        if not user.is_active:
            raise serializers.ValidationError("Account is inactive.")

        return user



############################ LOGIN USER - JWT Token Obtain  ###########################
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer): 

#     def validate(self, attrs):
#         # Let SimpleJWT handle authentication first
#         data = super().validate(attrs)

#         user = self.user

#         if not user.is_verifiedEmail:
#             raise AuthenticationFailed("Email is not verified")
#         if not user.is_active:
#             raise AuthenticationFailed("Email is not active")

#         # Add custom user fields to response
#         data.update({
#             'id'               : user.id,
#             'role'             : user.role,
#             'email'            : user.email,
#             'first_name'       : user.first_name,
#             'last_name'        : user.last_name,
#             'full_name'        : user.get_full_name(),
#             'is_verifiedEmail' : user.is_verifiedEmail,
#             'profile_picture'  : user.profile_picture
#         })

        # return data



    




#####################################   CustomUser  CRUD  ############################################################333
class CustomUserSerializer(serializers.ModelSerializer):
    profile   = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'role','first_name', 'last_name','email','is_active','date_joined','last_login', 'profile','full_name','is_verifiedEmail']
        read_only_fields = [
           'profile', 'full_name', 'id', 'is_verifiedEmail','is_superuser', 'is_active', 'is_staff', 'role' 
           'admin_profile', 'buyer_profile','developer_profile','broker_profile','agent_profile'     
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name.title()} {obj.last_name.title()}"
   
   
   
    def get_profile(self, obj):  # obj is the user object
        
        if obj.role == "admin" and hasattr(obj, 'admin_profile'):
            try:
                print(f"Fetching Admin profile for user: {obj.first_name}")
                return AdminProfileSerializer(obj.admin_profile).data
            except AdminProfile.DoesNotExist:
                return None
        
        
        if obj.role == "buyer" and hasattr(obj, 'buyer_profile'):
            try:  
                print(f"Fetching buyer profile for user: {obj.first_name}")
                return BuyerProfileSerializer(obj.buyer_profile).data 
            except(BuyerProfile.DoesNotExist):
                print(f"Buyer Profile does not exist for user")
                return None
        
        
        if obj.role == "developer" and hasattr(obj, 'developer_profile'):
            try:  
                print(f"Fetching developer profile for user: {obj.first_name}")
                return DeveloperProfileSerializer(obj.developer_profile).data 
            except(DeveloperProfile.DoesNotExist):
                print(f"Developer Profile does not exist for user")
                return None
    
    
        if obj.role == "broker" and hasattr(obj,'broker_profile'):
            try:  
                print(f"Fetching broker profile for user: {obj.first_name}")
                return BrokerProfileSerializer(obj.broker_profile).data 
            except(BrokerProfile.DoesNotExist):
                print(f"Broker Profile does not exist for user")
                return None


        if obj.role == "agent" and hasattr(obj,'agent_profile'):
            try:  
                print(f"Fetching agent profile for user: {obj.first_name}")
                return AgentProfileSerializer(obj.agent_profile).data 
            except(AgentProfile.DoesNotExist):
                print(f"Agent Profile does not exist for user")
                return None



################################## Profiles -  Admin - buyer ##########################
# dminProfile
class AdminProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = AdminProfile
        exclude = ['user']
    
    def validate_phone_number(value):
        if not value :
            raise serializers.ValidationError("phone_number field is required")
        return value          

# BuyerProfile
class BuyerProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = BuyerProfile
        exclude = ['user']
        
    def validate_phone_number(value):
        if not value :
            raise serializers.ValidationError("phone_number field is required")
        return value  

# BuyerPublicProfile
class BuyerPublicProfileSerializer(BuyerProfileSerializer):
    """ Child class that inherit from it's parents and changing Meta class properties """
    class Meta(BuyerProfileSerializer.Meta):
        exclude = [
            "date_of_birth","phone_number",
            "address","city","state","country"
        ]
    
    def validate_phone_number(value):
        if not value :
            raise serializers.ValidationError("phone_number field is required")
        return value  


class DeveloperProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeveloperProfile
        exclude = ['user']

    def validate_phone_number(value):
        if not value :
            raise serializers.ValidationError("phone_number field is required")
        return value  

class BrokerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrokerProfile
        exclude = ['user']

    def validate_phone_number(value):
        if not value :
            raise serializers.ValidationError("phone_number field is required")
        return value  

class AgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        exclude = ['user']

    def validate_phone_number(value):
        if not value :
            raise serializers.ValidationError("phone_number field is required")
        return value  





################################## detail user + detail profile ##########################
class RetrieveUserSerializer(serializers.ModelSerializer):
    # profiles 
    admin_profile     = serializers.SerializerMethodField()
    buyer_profile     = serializers.SerializerMethodField()
    developer_profile = serializers.SerializerMethodField()
    broker_profile    = serializers.SerializerMethodField()
    agent_profile     = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'password', 'password2',
            'buyer_profile', 'admin_profile', 'is_verifiedEmail', 'is_active', 'is_staff',
            'is_superuser','role'     
        ]

    def get_admin_profile(self, obj):
        # user object only has attribute 'admin_profile' if the user is an admin
        if obj.role == "admin" and hasattr(obj, 'admin_profile'):
            try:
                ap = obj.admin_profile
                return AdminProfileSerializer(ap).data
            except AdminProfile.DoesNotExist:
                return None
        return None
    

    def get_buyer_profile(self, obj):
         # user object only has attribute 'buyer_profile' if the user is a buyer
        if obj.role == "buyer" and hasattr(obj, 'buyer_profile'):
            try:
                cp = obj.buyer_profile
                return BuyerProfileSerializer(cp).data
            except BuyerProfile.DoesNotExist:
                return None
        return None
    
    def get_developer_profile(self, obj):
         # user object only has attribute 'developer_profile' if the user is a developer
        if obj.role == "developer" and hasattr(obj, 'developer_profile'):
            try:
                cp = obj.developer_profile
                return DeveloperProfileSerializer(cp).data
            except DeveloperProfile.DoesNotExist:
                return None
        return None 
    
            
    def get_broker_profile(self, obj):
         # user object only has attribute 'broker_profile' if the user is a broker
        if obj.role == "broker" and hasattr(obj, 'broker_profile'):
            try:
                cp = obj.broker_profile
                return BrokerProfileSerializer(cp).data
            except BrokerProfile.DoesNotExist:
                return None
        return None 
        
   
    def get_agent_profile(self, obj):
         # user object only has attribute 'agent_profile' if the user is a agent
        if obj.role == "agent" and hasattr(obj, 'agent_profile'):
            try:
                cp = obj.agent_profile
                return AgentProfileSerializer(cp).data
            except AgentProfile.DoesNotExist:
                return None
        return None 
    






### OTP-for verified email ###########
# class UserOTPSerializer(serializers.ModelSerializer):
#     otp = serializers.CharField(max_length=6, write_only=True)

#     class Meta:
#         model=UserOTP
#         fields = ['otp']
    
#     def validate_otp(self, value):
#         if value is None:
#             raise serializers.ValidationError("The otp field is required") 
#         return value
    





### logout ###########  used if we want to add token to blacklist using this serializer 
class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(
                                    write_only=True,
                                    required=True,
                                    error_messages={
                                        "message": "Refresh token cannot be empty.",
                                    },
    )

    default_error_messages = {
        'bad_token': 'Token is expired or invalid'
    }

    def validate(self, attrs):
        self.token = attrs.get('refresh_token')
        return attrs

    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            print('token will blacklist inside LogoutUserSerializer=',token)
            token.blacklist()
            return {"message": "You have been logged out successfully."}
        
        except TokenError as e:
            # Log the error if needed
            print(f"TokenError: {str(e)}")
            self.fail('bad_token')
#####################################################################################################################3
    







        
#  we will use this user serializer in property reviews list page 
class SimplifiedUserSerializer(serializers.ModelSerializer):
    profile   = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model =  CustomUser
        fields = ['id', 'email', 'full_name', 'profile']

    def get_profile(self, obj):
        return CustomUserSerializer.get_profile(self, obj)  # Reuse the logic from UserSerializer

    def get_full_name(self, obj):
        return CustomUserSerializer.get_full_name(self, obj)
    
        
            
        
        
        
##################  Update Profile fields + User fields    by    request user  #######################
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'is_verifiedEmail', 'email', 'is_active', 'is_superuser', 'is_staff', 'role']
        read_only_fields = ('email', 'is_superuser', 'is_staff', 'role')

        def update(self, instance, validated_data): # work ok 
            print('validated_data=',validated_data)
            instance.first_name = validated_data.get('first_name', instance.first_name)
            instance.last_name  = validated_data.get('last_name', instance.last_name)
            instance.is_verifiedEmail  = validated_data.get('is_verifiedEmail', instance.is_verifiedEmail)
            instance.is_active  = validated_data.get('is_active', instance.is_active)
            instance.save()
            user = CustomUser(instance)
            user.save()
            # return user  
            return super().update(instance, validated_data)  
      
 
 
class UpdateAdminProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer(required=True)
    class Meta:
        model = AdminProfile
        fields = ['user','date_of_birth','gender','phone_number','country', 'address','profile_picture']  # replace 'other_profile_fields' with actual fields from EmployeeProfile model

    def update(self, instance, validated_data):   # Update AdminProfile fields + User fields
        print('validated_data=',validated_data)
        valid_user_data = validated_data.pop('user', None)
        if valid_user_data:
            user = instance.user
            for attr, value in valid_user_data.items():
                if attr in ['first_name','last_name']:
                    setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)
    
    
class UpdateBuyerProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer(required=True,many=False)
    class Meta:
        model = BuyerProfile
        fields = ['user', 'date_of_birth','gender','phone_number','country', 'address','profile_picture'] 

    def update(self, instance, validated_data): # Update BuyerProfile fields + User fields
        print('validated_data',validated_data)
        valid_user_data = validated_data.pop('user', None)
        if valid_user_data:
            user = instance.user
            for attr, value in valid_user_data.items():
                if attr in ['first_name', 'last_name']:
                    setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)       
       
       


class UpdateDeveloperProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer(required=True,many=False)
    class Meta:
        model = DeveloperProfile
        fields = ['user', 'date_of_birth','phone_number','country', 'address','profile_picture'] 

    def update(self, instance, validated_data): # Update DeveloperProfile fields + User fields
        print('validated_data',validated_data)
        valid_user_data = validated_data.pop('user', None)
        if valid_user_data:
            user = instance.user
            for attr, value in valid_user_data.items():
                if attr in ['first_name', 'last_name']:
                    setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)       
       
       
class UpdateBrokerProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer(required=True,many=False)
    class Meta:
        model = BrokerProfile
        fields = ['user', 'broker_name','phone_number','country', 'address','profile_picture','contact_email',
                  'bio', 'website', 'twitter'] 

    def update(self, instance, validated_data): # Update BrokerProfile fields + User fields
        print('validated_data',validated_data)
        valid_user_data = validated_data.pop('user', None)
        if valid_user_data:
            user = instance.user
            for attr, value in valid_user_data.items():
                if attr in ['first_name', 'last_name']:
                    setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)       
       


class UpdateAgentProfileSerializer(serializers.ModelSerializer):
    user = UpdateUserSerializer(required=True,many=False)
    class Meta:
        model = AgentProfile
        fields = ['user', 'date_of_birth','phone_number','country', 'address','profile_picture'] 

    def update(self, instance, validated_data): # Update AgentProfile fields + User fields
        print('validated_data',validated_data)
        valid_user_data = validated_data.pop('user', None)
        if valid_user_data:
            user = instance.user
            for attr, value in valid_user_data.items():
                if attr in ['first_name', 'last_name']:
                    setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)       
       

###########################################################################################################################








###################################### Forget password Services // you need to reset your password ####################################################333
### 1- Password Reset Request ########### // send password reset request as a link to the user email
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=None, min_length=None, allow_blank=False)

    class Meta:
        fields = ['email']

    def validate(self, attrs):   
        email = attrs.get('email')
        if CustomUser.objects.filter(email=email).exists():
            user= CustomUser.objects.get(email=email)
            # uidb64
            uidb64=urlsafe_base64_encode(smart_bytes(user.id))
            # token
            token = PasswordResetTokenGenerator().make_token(user)
            # current site domain 
            request=self.context.get('request')
            # current_site=get_current_site(request).domain
            current_site = settings.FRONTEND_DOMAIN
            print('current_site',current_site)
            # relative_link // endpoint
            relative_link =reverse('users:password-reset-confirm', kwargs={'uidb64':uidb64, 'token':token})
            print('relative_link',relative_link)
            abslink=f"http://{current_site}{relative_link}"
            print('abslink',abslink)
            email_body=f"Hi {user.first_name} use the link below to reset your password {abslink}"
            data={
                'email_body':email_body, 
                'email_subject':"Reset your Password", 
                'to_email':user.email
                }
            send_normal_email(data)

        return super().validate(attrs)

    
### 2- password reset confirm ###### no need serializer
    
### 3- Set New Password ###########   
class SetNewPasswordSerializer(serializers.Serializer):
    password=serializers.CharField(max_length=100, min_length=6, write_only=True)
    confirm_password=serializers.CharField(max_length=100, min_length=6, write_only=True)
    uidb64=serializers.CharField(min_length=1, write_only=True)
    token=serializers.CharField(min_length=3, write_only=True)

    class Meta:
        fields = ['password', 'confirm_password', 'uidb64', 'token']

    def validate(self, attrs):
        try:
            token=attrs.get('token')
            # print("SetNewPasswordSerializer- token=",token)
            uidb64=attrs.get('uidb64')
            # print("SetNewPasswordSerializer- uidb64=",uidb64)
            password=attrs.get('password')
            # print("SetNewPasswordSerializer- password=",password)
            confirm_password=attrs.get('confirm_password')
            # print("SetNewPasswordSerializer- confirm_password=",confirm_password)
            
            user_id=force_str(urlsafe_base64_decode(uidb64))
            user=CustomUser.objects.get(id=user_id)
            # print("SetNewPasswordSerializer- user=",user)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("reset link is invalid or has expired", 401)
            if password != confirm_password:
                raise AuthenticationFailed("passwords do not match")
            
            user.set_password(password)
            user.save()
            return user
        
        except Exception as e:
            return AuthenticationFailed("link is invalid or has expired")




    

###################################### Change password Services  ####################################################333
### Change Password ###########    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
    def validate_new_password(self, value):
        # Validate the password meets strength requirements
        validate_password(value)
        return value

    def validate_old_password(self, value):
        print("self.context",self.context)
        user = self.context['request'].user
        # Check if the old password matches the current password of the user
        if not check_password(value, user.password):
            raise serializers.ValidationError("Old password does not match.")
        return value
    
    def validate(self, data):
        old_password = data.get('old_password', None)
        new_password = data.get('new_password', None)

        if old_password and new_password and old_password == new_password:
            raise serializers.ValidationError("New password cannot be the same as old password.")

        return data

    



# class InstructorSkillSerializer(serializers.ModelSerializer):
#     instructor = serializers.StringRelatedField()
    
#     class Meta:
#         model = InstructorSkill
#         fields = "__all__"


# class SkillCertificationSerializer(serializers.ModelSerializer):
#     instructor = serializers.SerializerMethodField()
    
#     def get_instructor(self, obj):
#         return obj.skill.instructor.user.email  
    
#     class Meta:
#         model = SkillCertification
#         fields = "__all__"
        
        
        
        
      
# class ConfirmPhoneNumberSerializer(serializers.ModelSerializer):
#     number = serializers.CharField(max_length=6, required=True,
#                                     validators=[MinValueValidator(100000),
#                                                 MaxValueValidator(999999)])
#     def validate_number(self, value):
#         if not value.isdigit():
#             raise serializers.ValidationError("Number must be a string of digits.")
  
#         # Retrieve the SMSCode instance for the authenticated user
#         sms_code = SMSCode.objects.filter(user=self.context['request'].user).first()
#         if not sms_code:
#             raise serializers.ValidationError("No SMS verification code found for this user.")
        
#         # Compare the user-provided number with the number in the SMSCode instance
#         if value != sms_code.number:
#             raise serializers.ValidationError("Incorrect SMS verification code.")
        
#         return value
        
#     class Meta:
#         model = SMSCode
#         fields = ['number']
        
        






 

# class InstructorProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = InstructorProfile
#         exclude = ['user']

# class InstructorPublicProfileSerializer(InstructorProfileSerializer):
#     """ Child class that inherit from it's parents and changing Meta class properties """
#     class Meta(InstructorProfileSerializer.Meta):
#         exclude = [
#             "date_of_birth","phone_number",
#             "address","city","state","country"
        # ]  
    

class JoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequest
        fields = ['id', 'full_name', 'email', 'role_requested', 'job_title', 'experience_years', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

class AdminJoinRequestActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'reject'])