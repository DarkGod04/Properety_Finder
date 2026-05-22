# DJANGO
from django.contrib.auth import get_user_model, tokens
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.shortcuts import render, get_object_or_404
from django.http import Http404, HttpResponse, JsonResponse
from django.core.mail import EmailMessage, send_mail
from django.conf import settings
from django.template.loader import render_to_string


# DRF
from rest_framework import views, permissions, status
from rest_framework.response import Response
# JWT
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.exceptions import InvalidToken
# pagination
from pagination.pagination import CustomPagination  
# LOCAL
from .models import  CustomUser, BuyerProfile, AdminProfile, DeveloperProfile,BrokerProfile,AgentProfile,UserOTP
from .serializers import RegisteUserProfileSerializer, CustomUserSerializer,  LoginUserSerializer, LogoutSerializer, UpdateUserSerializer, AdminProfileSerializer, BuyerProfileSerializer, UpdateBuyerProfileSerializer, UpdateAdminProfileSerializer, DeveloperProfileSerializer, UpdateDeveloperProfileSerializer, BrokerProfileSerializer, UpdateBrokerProfileSerializer, AgentProfileSerializer, UpdateAgentProfileSerializer, PasswordResetRequestSerializer, SetNewPasswordSerializer, ChangePasswordSerializer
from .utils import modifySendOTPToEmail
from proj.settings import DEFAULT_FROM_EMAIL








###################################### Authentication-proccess  ####################################################333
### (Register a new user +  send OTP to email) - for any type or roles :  buyer - developer - broker - agent  ###########
class UserProfileRegisterAPIView(views.APIView): 
    queryset = get_user_model().objects.all()
    serializer_class = RegisteUserProfileSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = self.queryset
        return queryset
      
    def post(self, request, *args, **kwargs):
        print('register-request.data=',request.data)
        serializer = self.serializer_class(data=request.data)
        print('serializer.initial_data=',serializer.initial_data)
        if serializer.is_valid():
            print('valid serializer=',serializer)
            serializer.save()
            user = serializer.data
            print('user=',user)
            
            # send user otp to email 
            # modifySendOTPToEmail(user.get('email'), request)
            return Response({
                'user': user,
                'register_message': 'Thanks for signing up. Email conirmation link has been sent to verify your email.'
            }, status=status.HTTP_201_CREATED)
            
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)  # Log the errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
           
       

# confirm user email by a link 
class ConfirmUserEmailByLinkAPIView(views.APIView):
    queryset = get_user_model().objects.all()
    # serializer_class = ConfirmUserEmailSerializer
    permission_classes = [permissions.AllowAny]
    

    def get(self, request, uidb64, token):
        try:
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            print('user_id=',user_id)
            user = get_user_model().objects.get(id=user_id)
            print('user=',user)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            return Response({"error": "Invalid user ID"}, status=400)

        if default_token_generator.check_token(user, token):
            print('token=',token)
            user.is_active = True
            user.is_verifiedEmail = True
            user.save()
            return Response({"message": "Email confirmation successful"})
        else:
            return Response({"error": "Invalid token"}, status=400)
        

        
        
       



# resend manually confirm user email by a link 
import logging

# Avoid print() in production code. Use Django’s logging framework:
logger = logging.getLogger(__name__)

class ResendConfirmEmailAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        logger.info(f"Resend email request for {email}")
        try:
            user = get_user_model().objects.get(email=email)
            if not user.is_verifiedEmail:
                subject = 'Confirm Your Email link'
                message = render_to_string('users/confirm-email.html', 
                            {
                                'user': user,
                                'domain': settings.FRONTEND_DOMAIN,  # Or request.get_host()
                                'uid': urlsafe_base64_encode(smart_bytes(user.id)),
                                'token': default_token_generator.make_token(user),
                            })
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
        
        except get_user_model().DoesNotExist:
            pass

        return Response({'detail': 'If an account with that email exists and is not verified, a confirmation email was sent.'})





### OTP-for verified email by send otp to user email ###########
# class VerifyUserEmailByUserOTPAPIView(views.APIView):
#     serializer_class = UserOTPSerializer
#     permission_classes=[permissions.AllowAny]
    
#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#                 otp = serializer.validated_data['otp']
#                 print('otp=',otp)
             
#                 try:
#                     user_otp_obj = get_object_or_404(UserOTP,otp=otp)
#                     print('user_pass_obj=', user_otp_obj)
#                     user = user_otp_obj.user
#                     print('user from otp object=',user)
#                     if user.is_verifiedEmail == False :
#                         user.is_verifiedEmail=True
#                         user.save()
#                         print('User saved successfully') 
#                         return response.Response({'message':'account email verified successfully'}, status=status.HTTP_200_OK)                                                      
#                     return response.Response({'message':'passcode is invalid user is already verified'}, status=status.HTTP_204_NO_CONTENT)
                
#                 except UserOTP.DoesNotExist:
#                     return response.Response({"error": "otp error - passcode is invalid ! please enter valid otp code"}, status=status.HTTP_404_NOT_FOUND)    
        
#         return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       



class LoginAPIView(views.APIView):
    serializer_class = LoginUserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            print('LoginAPIView-user=',user)

            refresh = RefreshToken.for_user(user)
            print('LoginAPIView-refresh=',refresh)
            access_token = str(refresh.access_token)
            print('LoginAPIView-refreshed-access_token=',access_token)

            response = Response({
                "user": CustomUserSerializer(user).data
            }, status=status.HTTP_200_OK)

            is_production = not settings.DEBUG
            response.set_cookie(
                key="access_token", 
                value=access_token,
                httponly=True,
                secure=is_production,
                samesite="None" if is_production else "Lax",
            )
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=is_production,
                samesite="None" if is_production else "Lax",
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


#################  token_refresh/ ##################
class CookieCustomTokenRefreshView(TokenRefreshView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        print('refresh_token=', refresh_token)

        # refresh _token is not found
        if not refresh_token:
            return Response({"error": "Refresh token not provided"},
                            status=status.HTTP_401_UNAUTHORIZED)
       
        # refresh _token is found 
        try:
            # refresh _token is not expired
            refresh = RefreshToken(refresh_token)  # may raise ExpiredTokenError
            access_token = str(refresh.access_token)
            print('new_access_token=', access_token)
            response = Response({"message": "Access token refreshed successfully"},
                                status=status.HTTP_200_OK
            )
            is_production = not settings.DEBUG
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=is_production,
                samesite="None" if is_production else "Lax",
            )
            return response

        # refresh _token is invalid or expired
        except TokenError:  # catches ExpiredTokenError + InvalidToken
            return Response({"error": "Invalid or expired refresh token"},
                            status=status.HTTP_401_UNAUTHORIZED)
    
    
    
    
    
# ####################### LogoutAPIView ###############################################333
class LogoutAPIView(views.APIView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception as e:
            return Response({"error in vadilating token": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        response = Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        # ✅ Clear cookies explicitly
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")
        print('deleted_access_token=', access_token)
        print('deleted_refresh_token=', refresh_token)
        return response



#  JWT
### login by email & password to get ACCESS TOKEN + REFRESH TOKEN  ###########
# class CustomTokenObtainPairView(TokenObtainPairView):
#     serializer_class=CustomTokenObtainPairSerializer
#     permission_classes=[permissions.AllowAny]
    
    





### logout  ###########
# class LogoutAPIView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         serializer = LogoutSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         try:
#             serializer.save()
#             return response.Response(
#                 {"detail": "Logout successful."},
#                 status=status.HTTP_205_RESET_CONTENT
#             )
#         except TokenError as e:
#             return response.Response(
#                 {"detail": "Token is invalid or expired."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        

#### only testing that user did Authenticated correctly 
class TestingAuthenticatedReq(views.APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request):
        data={
            'msg':'its works'
        }
        return Response(data, status=status.HTTP_200_OK)        
########################################################################################################################





#####################################   UserModel  CRUD  APIView  ############################################################333
#  path('list-user/', views.ListUserAPIView.as_view(), name='list-user'),
# all usetrs list only for admin
class ListUserAPIView(views.APIView):
    serializer_class   = CustomUserSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = CustomPagination
    
    def get(self, request, format=None):
        queryset = get_user_model().objects.all()
        #  with Apply pagination
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        
        if paginated_queryset is not None:
            serializer = self.serializer_class(paginated_queryset, many=True)
            # print('paginated serializer=',serializer)
            return paginator.get_paginated_response(serializer.data)

        # If no pagination, return the full queryset
        serializer = self.serializer_class(queryset, many=True)
        # print('no paginated serializer=',serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
        



# buyers list 
# path('list-buyer/', views.ListUserAPIView.as_view(), name='list-buyer'),
class ListBuyerAPIView(views.APIView):
    serializer_class   = CustomUserSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = CustomPagination
    
    def get(self, request, format=None):
        queryset = get_user_model().objects.filter(role="buyer")
        print('buyer queryset=',queryset)
        #  with Apply pagination
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        
        if paginated_queryset is not None:
            serializer = self.serializer_class(paginated_queryset, many=True)
            # print('paginated serializer=',serializer)
            return paginator.get_paginated_response(serializer.data)

        # If no pagination, return the full queryset
        serializer = self.serializer_class(queryset, many=True)
        # print('no paginated serializer=',serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
        
       
       

                
           
#  UserDetail by id -  by admin only 
#  path('user-detail/<str:id>/', views.UserDetailAPIView.as_view(), name='user-detail'),    
class DetailUserAPIView(views.APIView):
    permission_classes=[permissions.IsAdminUser]
    serializer_class=CustomUserSerializer
    queryset = get_user_model().objects.all()
    # lookup_field = "id"
    def get(self,request,*args,**kwargs):
        id = kwargs.get('id')
        print(id)
        user = get_object_or_404(CustomUser, id=id)
        serializer = self.serializer_class(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
 

# update user selected  by id by admin only
class UpdateUserAPIView(views.APIView):
    permission_classes=[permissions.IsAdminUser]
    serializer_class=UpdateUserSerializer
    queryset = get_user_model().objects.all()
    
    def get_object(self,id):
        try:
            return get_user_model().objects.get(id=id)
        except get_user_model().DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, id, format=None):
        # check permission for the user is admin user 
        if self.request.user.is_superuser == False :
            return Response({
                "error" : "Permission Denied",
                }, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object(id)
        print('selected user =',user)
        serializer = self.serializer_class(user, data=request.data)
        print('serializer request.data =',request.data)
        print('serializer before validation =',serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    








# delete user selected  by id by admin only     
class DeleteUserAPIView(views.APIView):
    permission_classes=[permissions.IsAdminUser]
    serializer_class=CustomUserSerializer
    queryset = get_user_model().objects.all()

    def delete(self,request,*args,**kwargs):
        id = kwargs.get('id')
        user = get_object_or_404(get_user_model(), id=id)
        print(user.email)
        if self.request.user.is_superuser == False :
            return Response({
                "error" : "Permission Denied",
                }, status=status.HTTP_403_FORBIDDEN)
        else: 
            user.delete()
            return Response({'success' : 'user deleted successfully'},status=status.HTTP_204_NO_CONTENT)
########################################################################################################################
       



# #################################### by request user only ########################################
#path('request-user/', views.RequestUserDetailAPIView.as_view(), name='request-user'),
#   get request user data FOR Navbar in react 

class DetailRequestUserAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]  # Ensure this line is uncommented
    serializer_class = CustomUserSerializer

    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(get_user_model(), id=request.user.id)
            print('request.user=', request.user)
        
        except get_user_model().DoesNotExist:
            print('request.user=', "not found request user")
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.serializer_class(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

  
  
  
    
##############################update profile by request.user only #############33333
# only request user can update his profile(  general for buyer or admin) 
class UpdateRequestUserProfileAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, *args, **kwargs):
        user = request.user
        
        if request.user.is_superuser == True:
            try:
                instance_admin_profile = AdminProfile.objects.get(user=request.user)
                serializer = UpdateAdminProfileSerializer(instance_admin_profile, data=request.data, partial=True)
            except AdminProfile.DoesNotExist:
                return Response({'error': 'Admin Profile not found'}, status=status.HTTP_404_NOT_FOUND)  
        
        
        if request.user.role == "buyer":
            try:
                instance_buyer_profile = BuyerProfile.objects.get(user=request.user)
                serializer = UpdateBuyerProfileSerializer(instance_buyer_profile, data=request.data, partial=True)
            except BuyerProfile.DoesNotExist:
                return Response({'error': 'Buyer Profile not found'}, status=status.HTTP_404_NOT_FOUND)                 
            
            
        if request.user.role == "developer" :
            try:
                instance_developer_profile = DeveloperProfile.objects.get(user=request.user)
                serializer = UpdateDeveloperProfileSerializer(instance_developer_profile, data=request.data, partial=True)
            except DeveloperProfile.DoesNotExist:
                return Response({'error': 'Developer Profile not found'}, status=status.HTTP_404_NOT_FOUND)                                 
        
        
        if request.user.role == "broker" :
            try:
                instance_broker_profile = BrokerProfile.objects.get(user=request.user)
                serializer = UpdateBrokerProfileSerializer(instance_broker_profile, data=request.data, partial=True)
            except BrokerProfile.DoesNotExist:
                return Response({'error': 'Broker Profile not found'}, status=status.HTTP_404_NOT_FOUND)                                 

        if request.user.role == "agent" :
            try:
                instance_agent_profile = AgentProfile.objects.get(user=request.user)
                serializer = UpdateAgentProfileSerializer(instance_agent_profile, data=request.data, partial=True)
            except AgentProfile.DoesNotExist:
                return Response({'error': 'Agent Profile not found'}, status=status.HTTP_404_NOT_FOUND)   
        
        if serializer.is_valid():
            print("Serializer is valid")  # Debugging line
            self.perform_update(serializer,user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        print("Serializer errors:", serializer.errors)  # Debugging line
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
   
   
    def perform_update(self, serializer, user):
        first_name = self.request.data.get("first_name")
        last_name = self.request.data.get("last_name")

        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        user.save()

        serializer.save()




class RequestUserProfileAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]  # Ensure this line is uncommented

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            print('request.user=', request.user)
        
        except get_user_model().DoesNotExist:
            print('request.user=', "not found request user")
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        
        if user.is_superuser == True:
            try:
                instance_admin_profile = AdminProfile.objects.get(user=request.user)
                serializer = AdminProfileSerializer(instance_admin_profile)
                data = serializer.data
                data.update({
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "role": user.role,
                })
                return Response(data, status=status.HTTP_200_OK)
            except AdminProfile.DoesNotExist:
                return Response({'error': 'Admin Profile not found'}, status=status.HTTP_404_NOT_FOUND)  
        
        
        if request.user.role == "buyer" :
            try:
                instance_buyer_profile = BuyerProfile.objects.get(user=request.user)
                serializer = BuyerProfileSerializer(instance_buyer_profile)
                data = serializer.data
                data.update({
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "role": user.role,
                })
                return Response(data, status=status.HTTP_200_OK)
            except BuyerProfile.DoesNotExist:
                return Response({'error': 'Buyer Profile not found'}, status=status.HTTP_404_NOT_FOUND)                 
            
            
        if request.user.role == "developer" :
            try:
                instance_developer_profile = DeveloperProfile.objects.get(user=request.user)
                serializer = DeveloperProfileSerializer(instance_developer_profile)
                data = serializer.data
                data.update({
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "role": user.role,
                })
                return Response(data, status=status.HTTP_200_OK)
            except DeveloperProfile.DoesNotExist:
                return Response({'error': 'Developer Profile not found'}, status=status.HTTP_404_NOT_FOUND)    

            
        if request.user.role == "broker" :
            try:
                instance_broker_profile = BrokerProfile.objects.get(user=request.user)
                serializer = BrokerProfileSerializer(instance_broker_profile)
                data = serializer.data
                data.update({
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "role": user.role,
                })
                return Response(data, status=status.HTTP_200_OK)
            except BrokerProfile.DoesNotExist:
                return Response({'error': 'Broker Profile not found'}, status=status.HTTP_404_NOT_FOUND)    

    
        if request.user.role == "agent" :
            try:
                instance_agent_profile = AgentProfile.objects.get(user=request.user)
                serializer = AgentProfileSerializer(instance_agent_profile)
                data = serializer.data
                data.update({
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "role": user.role,
                })
                return Response(data, status=status.HTTP_200_OK)
            except AgentProfile.DoesNotExist:
                return Response({'error': 'Agent Profile not found'}, status=status.HTTP_404_NOT_FOUND) 
    
    
    
    
    
    
# class UpdateRequestBuyerProfileAPIView(views.APIView):
#     serializer_class = UpdateBuyerProfileSerializer
#     permission_classes = [permissions.IsAuthenticated]
    
#     def put(self, request, *args, **kwargs):
#         user = request.user
#         try:
#             instance_profile = BuyerProfile.objects.get(user=user)
#         except BuyerProfile.DoesNotExist:
#             return response.Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)  
#         serializer = self.serializer_class(instance_profile, data=request.data, partial=True)
#         if serializer.is_valid():
#             print("Serializer is valid")  # Debugging line
#             self.perform_update(serializer,user)
#             return response.Response(serializer.data, status=status.HTTP_200_OK)
#         print("Serializer errors:", serializer.errors)  # Debugging line
#         return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
#     def perform_update(self,serializer,user):
#         # user_data = serializer.validated_data.get('user', {})
#         user_data = serializer.validated_data.pop('user',None)
#         print('user_data',user_data)
#         if user_data:
#             print("User data to update:", user_data)  # Debugging line
#             for attr,value in user_data.items():
#                 if attr in ['first_name', 'last_name']:
#                     print(f"Updating {attr} to {value}")  # Debugging line
#                     setattr(user, attr, value)
#             user.save()
#         serializer.save()



# class UpdateRequestAdminProfileAPIView(views.APIView):
#     serializer_class = UpdateAdminProfileSerializer
#     permission_classes = [permissions.IsAuthenticated]
    
#     def put(self, request, *args, **kwargs):
#         user = request.user
#         try:
#             instance_profile = AdminProfile.objects.get(user=user)
#         except AdminProfile.DoesNotExist:
#             return response.Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)  
#         serializer = self.serializer_class(instance_profile, data=request.data, partial=True)
#         if serializer.is_valid():
#             print("Serializer is valid")  # Debugging line
#             self.perform_update(serializer,user)
#             return response.Response(serializer.data, status=status.HTTP_200_OK)
#         print("Serializer errors:", serializer.errors)  # Debugging line
#         return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
#     def perform_update(self,serializer,user):
#         # user_data = serializer.validated_data.get('user', {})
#         user_data = serializer.validated_data.pop('user',None)
#         print('user_data',user_data)
#         if user_data:
#             print("User data to update:", user_data)  # Debugging line
#             for attr, value in user_data.items():
#                 if attr in ['first_name', 'last_name']:
#                     print(f"Updating {attr} to {value}")  # Debugging line
#                     setattr(user, attr, value)
#             user.save()
#         serializer.save()



  

###################################### Forget password Services  ####################################################333
### 1- Password Reset Request ###########
class PasswordResetRequestView(views.APIView):
    serializer_class=PasswordResetRequestSerializer
    permission_classes=[permissions.AllowAny]

    def post(self, request):
        serializer=self.serializer_class(data=request.data, context={'request':request})
        if serializer.is_valid():
            return Response({'message':'we have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        # return Response({'message':'user with that email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message':'user with that email does not exist'}, status=status.HTTP_400_BAD_REQUEST)



### 2- password reset confirm ###### work  automatically when the user clik the link reached to his email
class PasswordResetConfirm(views.APIView):
    permission_classes=[permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            user_id=smart_str(urlsafe_base64_decode(uidb64))
            user=CustomUser.objects.get(id=user_id)
            if not tokens.PasswordResetTokenGenerator().check_token(user, token):
                return Response({'message':'password reset token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success':True, 'message':'credentials is valid', 'uidb64':uidb64, 'token':token}, status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return Response({'message':'password reset token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)



### 3- Set New Password ###########  
class SetNewPasswordView(views.APIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def patch(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success':True, 'message':"password reset is succesful"}, status=status.HTTP_200_OK)



###################################### Change password Services  ####################################################333
### Change Password ###########
class ChangePasswordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request}  # ✅ pass request into serializer
        )
        serializer.is_valid(raise_exception=True)

        old_password = serializer.validated_data.get("old_password")
        new_password = serializer.validated_data.get("new_password")

        if not request.user.check_password(old_password):
            return Response(
                {"error": "Incorrect password"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.set_password(new_password)
        request.user.save()

        return Response(
            {"message": "Password changed successfully"}, 
            status=status.HTTP_200_OK
        )




# ---------------------------------------------------------------------------
# Join Request / Application Views
# ---------------------------------------------------------------------------
import uuid
from .models import JoinRequest
from .serializers import JoinRequestSerializer, AdminJoinRequestActionSerializer
from django.urls import reverse

class SubmitJoinRequestAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = JoinRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Your application has been submitted and is pending admin review."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListJoinRequestsAPIView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        status_filter = request.query_params.get("status", JoinRequest.StatusType.PENDING)
        queryset = JoinRequest.objects.filter(status=status_filter).order_by("-created_at")
        serializer = JoinRequestSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReviewJoinRequestAPIView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, request_id):
        join_request = get_object_or_404(JoinRequest, id=request_id)
        
        if join_request.status != JoinRequest.StatusType.PENDING:
            return Response({"error": "This request has already been reviewed."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AdminJoinRequestActionSerializer(data=request.data)
        if serializer.is_valid():
            action = serializer.validated_data["action"]
            if action == "approve":
                join_request.status = JoinRequest.StatusType.APPROVED
                join_request.token = uuid.uuid4()
                join_request.save()

                # Send email with token
                current_site = settings.FRONTEND_DOMAIN
                # frontend should have a route like /register?token=XYZ&role=developer
                registration_link = f"http://{current_site}/register?token={join_request.token}&role={join_request.role_requested}&email={join_request.email}"
                email_body = f"Hi {join_request.full_name},\n\nYour application to join as a {join_request.role_requested} has been approved! Please use the following link to complete your registration:\n\n{registration_link}"
                send_mail(
                    subject="Your Application has been Approved!",
                    message=email_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[join_request.email],
                    fail_silently=False,
                )
                return Response({"message": "Request approved. Registration link sent via email."}, status=status.HTTP_200_OK)
            
            elif action == "reject":
                join_request.status = JoinRequest.StatusType.REJECTED
                join_request.save()
                return Response({"message": "Request rejected."}, status=status.HTTP_200_OK)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
