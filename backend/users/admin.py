from django.contrib import admin
from .models import CustomUser, AdminProfile, BuyerProfile, DeveloperProfile, BrokerProfile, AgentProfile, UserOTP


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display  = ['email', 'first_name', 'last_name', 'role']
    list_filter   = ['date_joined', 'is_verifiedEmail', 'role']
    search_fields = ['email', 'first_name', 'last_name', 'role']




@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display  = ['user', 'profile_picture', 'phone_number', 'country', 'gender']
    list_filter   = ['phone_number']
    search_fields = ['phone_number', 'country', 'gender']




@admin.register(BuyerProfile)
class BuyerProfileAdmin(admin.ModelAdmin):
    list_display  = ['user', 'profile_picture', 'phone_number', 'country', 'gender']
    list_filter   = ['phone_number']
    search_fields = ['phone_number', 'country', 'gender']

    
    




admin.site.register(DeveloperProfile)
admin.site.register(BrokerProfile)
admin.site.register(AgentProfile)




    
@admin.register(UserOTP)
class UserOTP(admin.ModelAdmin):
    list_display  = [ 'user', 'otp']
   