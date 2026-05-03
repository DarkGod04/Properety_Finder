# https://github.com/django/django/blob/main/django/contrib/auth/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from phonenumber_field.modelfields import PhoneNumberField
import contextlib
import uuid



class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

        
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", CustomUser.RoleType.ADMIN)  # 👈 force admin role

        return self.create_user(email, password, **extra_fields)    
       
        
        
        
        
# https://github.com/django/django/blob/8be0c0d6901669661fca578f474cd51cd284d35a/django/contrib/auth/models.py#L517   
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    Username and password are required. Other fields are optional.
    """
class CustomUser(AbstractUser):  # from AbstractUser(AbstractBaseUser, PermissionsMixin)
    class RoleType(models.TextChoices):
        ADMIN     = "admin", "Admin"
        BUYER     = "buyer", "Buyer"
        DEVELOPER = "developer", "Developer"
        BROKER    = "broker", "Broker"
        AGENT     = "agent", "Agent"
        
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, blank=False, null=False)  
    role = models.CharField(max_length=20, choices=RoleType.choices, default=RoleType.BUYER)
    is_verifiedEmail = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    USERNAME_FIELD   = 'email'             # USERNAME_FIELD the field used as the unique identifier for the user
    REQUIRED_FIELDS  = ["first_name", "last_name"]
    username         = None
    first_name       = models.CharField( max_length=150, blank=True)
    last_name        = models.CharField( max_length=150, blank=True) 
    date_joined      = models.DateTimeField(auto_now_add=True)
    objects          = CustomUserManager()
    # enable_two_factor_authentication = models.BooleanField(null=True, blank=True)
    
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
    
    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = "%s %s" % (self.first_name, self.last_name)
        return full_name.strip()

    
    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    class Meta:
        ordering = ('-date_joined',)
        verbose_name = 'CustomUser'
        verbose_name_plural = 'CustomUser'

    
        
    @property
    def profile_picture(self):
        if self.role == "buyer" :
            try:
                profile_picture = BuyerProfile.objects.get(id=self.id).profile_picture
                print('profile_picture',profile_picture)
                return profile_picture
            except:
                DEFAULT_BUYER_IMAGE = 'default_profile/user_default.png'
                return DEFAULT_BUYER_IMAGE 
                
        if self.role == "developer" :
            try:
                profile_picture = DeveloperProfile.objects.get(id=self.id).profile_picture
                print('profile_picture',profile_picture)
                return profile_picture
            except:
                DEFAULT_DEVELOPER_IMAGE = 'default_profile/user_default.png'
                return DEFAULT_DEVELOPER_IMAGE  
        
        
        if self.role == "broker" :
            try:
                profile_picture = BrokerProfile.objects.get(id=self.id).profile_picture
                print('profile_picture',profile_picture)
                return profile_picture
            except:
                DEFAULT_BROKER_IMAGE = 'default_profile/user_default.png'
                return DEFAULT_BROKER_IMAGE 
        
        
        if self.role == "agent" :
            try:
                profile_picture = AgentProfile.objects.get(id=self.id).profile_picture
                print('profile_picture',profile_picture)
                return profile_picture
            except:
                DEFAULT_AGENT_IMAGE = 'default_profile/user_default.png'
                return DEFAULT_AGENT_IMAGE 
            
            
        if self.role == "admin" :
            try:    
                profile_picture = AdminProfile.objects.get(id=self.id).profile_picture
                print('profile_picture',profile_picture)
                return profile_picture
            except:
                DEFAULT_ADMIN_IMAGE = 'default_profile/user_default.png'
                return DEFAULT_ADMIN_IMAGE 
                
    
    
    
    def tokens(self):    
        refresh = RefreshToken.for_user(self)
        return {
            "refresh":str(refresh),
            "access" :str(refresh.access_token)
        }






################################### PROFILE #######################################################################33
class GenderType(models.TextChoices):
    MALE   = 'male'
    FEMALE = 'female'
    
    
class BuyerProfile(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    user            = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='buyer_profile')
    phone_number    = PhoneNumberField(blank=False, null=True)
    country         = models.CharField(max_length=50, blank=False, null=True)
    address         = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='buyer_profile_picture/',default='default_profile/user_default.png', blank=True, null=True)
    date_of_birth   = models.DateField(blank=True, null=True)
    gender          = models.CharField(max_length=60, choices=GenderType.choices, default=GenderType.MALE)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)
  
    def __str__(self):
        # you must use parentheses when calling a function
        return  self.user.get_full_name()
    
    def get_buyer_full_name(self):
        return f"{self.user.get_full_name()}"
    
    def save(self, *args, **kwargs):
        # Set the buyer profile id to be the same as the user id
        if not self.id:
            self.id = self.user.id 
        
        # Deletes old profile_picture when making an update to profile_picture
        with contextlib.suppress(Exception):
            old = BuyerProfile.objects.get(id=self.id)
            if old.profile_picture != self.profile_picture:
                old.profile_picture.delete(save=False)
        super().save(*args, **kwargs)
    



class DeveloperProfile(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    developer_name  = models.CharField(max_length=50, blank=False, null=True)
    user            = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='developer_profile')
    phone_number    = PhoneNumberField(blank=False, null=True)
    contact_email   = models.EmailField( blank=False, null=False) 
    bio             = models.TextField(blank=True, null=True)
    website         = models.URLField(blank=True, null=True)
    twitter         = models.URLField(blank=True, null=True)
    country         = models.CharField(max_length=50, blank=False, null=True)
    address         = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='developer_profile_picture/',default='default_profile/user_default.png', blank=True, null=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)
    # date_of_birth   = models.DateField(blank=True, null=True)
    # gender          = models.CharField(max_length=60, choices=GenderType.choices, default=GenderType.MALE)
    
    def __str__(self):
        # you must use parentheses when calling a function
        return  self.user.get_full_name()
    
    def get_developer_name(self):
        return f"{self.developer_name}"
    
    def save(self, *args, **kwargs):
        # Set the developer profile id to be the same as the user id
        if not self.id:
            self.id = self.user.id 
        # Deletes old profile_picture when making an update to profile_picture
        with contextlib.suppress(Exception):
            old = DeveloperProfile.objects.get(id=self.id)
            if old.profile_picture != self.profile_picture:
                old.profile_picture.delete(save=False)
        super().save(*args, **kwargs)
    




class BrokerProfile(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    broker_name     = models.CharField(max_length=50, blank=False, null=True)
    user            = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='broker_profile')
    phone_number    = PhoneNumberField(blank=False, null=True)
    contact_email   = models.EmailField( blank=False, null=False) 
    bio             = models.TextField(blank=True, null=True)
    website         = models.URLField(blank=True, null=True)
    twitter         = models.URLField(blank=True, null=True)
    country         = models.CharField(max_length=50, blank=False, null=True)
    address         = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='broker_profile_picture/',default='default_profile/user_default.png', blank=True, null=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)
    # date_of_birth   = models.DateField(blank=True, null=True)
    # gender          = models.CharField(max_length=60, choices=GenderType.choices, default=GenderType.MALE)
    
    def __str__(self):
        # you must use parentheses when calling a function
        return  self.user.get_full_name()
    
    def get_broker_name(self):
        return f"{self.broker_name}"
    
    def save(self, *args, **kwargs):
        # Set the broker profile id to be the same as the user id
        if not self.id:
            self.id = self.user.id 
        # Deletes old profile_picture when making an update to profile_picture
        with contextlib.suppress(Exception):
            old = BrokerProfile.objects.get(id=self.id)
            if old.profile_picture != self.profile_picture:
                old.profile_picture.delete(save=False)
        super().save(*args, **kwargs)
    





class AgentProfile(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    agent_name      = models.CharField(max_length=50, blank=False, null=True)
    user            = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='agent_profile')
    profile_picture = models.ImageField(upload_to='agent_profile_picture/',default='default_profile/user_default.png', blank=True, null=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)
    belong_to_broker= models.ForeignKey(BrokerProfile,on_delete=models.CASCADE, related_name='agents')  # ✅ one broker → many agents
    phone_number    = PhoneNumberField(blank=False, null=True)
    contact_email   = models.EmailField( blank=False, null=False) 
    country         = models.CharField(max_length=50, blank=False, null=True)
    address         = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth   = models.DateField(blank=True, null=True)
    gender          = models.CharField(max_length=60, choices=GenderType.choices, default=GenderType.MALE)
    
    def __str__(self):
        # you must use parentheses when calling a function
        return  self.user.get_full_name()
    
    def get_agent_name(self):
        return f"{self.agent_name}"
    
    def save(self, *args, **kwargs):
        # Set the agent profile id to be the same as the user id
        if not self.id:
            self.id = self.user.id 
        # Deletes old profile_picture when making an update to profile_picture
        with contextlib.suppress(Exception):
            old = AgentProfile.objects.get(id=self.id)
            if old.profile_picture != self.profile_picture:
                old.profile_picture.delete(save=False)
        super().save(*args, **kwargs)
    










class AdminProfile(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    user            = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='admin_profile')
    phone_number    = PhoneNumberField(blank=False, null=True)
    country         = models.CharField(max_length=50, blank=True, null=True)
    address         = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='admin_profile_picture/',default='default_profile/user_default.png', blank=True, null=True)
    date_of_birth   = models.DateField(blank=True, null=True)
    gender          = models.CharField(max_length=60, choices=GenderType.choices, default=GenderType.MALE)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)
   
    def __str__(self):
        return  self.user.get_full_name()
    
    def get_admin_full_name(self):
        return f"{self.user.get_full_name()}"
    
    def save(self, *args, **kwargs):
        # Set the admin profile id to be the same as the user id
        if not self.id:
            self.id = self.user.id  
        # Deletes old profile_picture when making an update to profile_picture
        with contextlib.suppress(Exception):
            old = AdminProfile.objects.get(id=self.id)
            if old.profile_picture != self.profile_picture:
                old.profile_picture.delete(save=False)
        super().save(*args, **kwargs) 








# ################################## OTP  - verifiedEmail #############################################33
# otp need to verify user email 
class UserOTP(models.Model):
    user       = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    otp        = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
     
    def __str__(self):
        return f"{self.user.email} - otp code"


class JoinRequest(models.Model):
    class StatusType(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    class RoleType(models.TextChoices):
        DEVELOPER = "developer", "Developer"
        BROKER = "broker", "Broker"
        AGENT = "agent", "Agent"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role_requested = models.CharField(max_length=20, choices=RoleType.choices)
    job_title = models.CharField(max_length=150)
    experience_years = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=StatusType.choices, default=StatusType.PENDING)
    token = models.UUIDField(null=True, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.role_requested} ({self.status})"