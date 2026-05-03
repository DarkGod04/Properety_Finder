from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

app_name ='users'

urlpatterns = [
    ####  Authentication-proccess ###
    # regiser
    path('register/', views.UserProfileRegisterAPIView.as_view(), name='register'),
    path('confirm-email/<uidb64>/<str:token>/', views.ConfirmUserEmailByLinkAPIView.as_view(), name='confirm-email-link'),
    path('resend-confirm-email/', views.ResendConfirmEmailAPIView.as_view(), name='resend-confirm-email'),
    
    # login-JWT- cookie
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('token_refresh/', views.CookieCustomTokenRefreshView.as_view(), name='token-refresh'),
    # logout
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('testing/', views.TestingAuthenticatedReq.as_view(), name='just-for-testing'),
    # path('verify-email-otp/', views.VerifyUserEmailByUserOTPAPIView.as_view(), name='verify-email-otp'),
    # login -JWT
    # path('login-token-obtain/', views.CustomTokenObtainPairView.as_view(), name='login-token-obtain'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  #jwt views classTokenRefreshView
    
    
    
    ### for admin only  ####
    #  user
    path('list-user/', views.ListUserAPIView.as_view(), name='list-user'),
    path('user-detail/<uuid:id>/', views.DetailUserAPIView.as_view(), name='user-detail'),
    path('user-update/<uuid:id>/', views.UpdateUserAPIView.as_view(), name='user-update'),
    path('user-delete/<uuid:id>/', views.DeleteUserAPIView.as_view(), name='user-delete'),
    # buyer
    path('list-buyer/', views.ListBuyerAPIView.as_view(), name='list-buyer'),

    # Join Request
    path('join-request/submit/', views.SubmitJoinRequestAPIView.as_view(), name='join-request-submit'),
    path('join-request/list/', views.ListJoinRequestsAPIView.as_view(), name='join-request-list'),
    path('join-request/review/<uuid:request_id>/', views.ReviewJoinRequestAPIView.as_view(), name='join-request-review'),

 #  for request user only
    path('request-user/', views.DetailRequestUserAPIView.as_view(), name='request-user'),
    path('request-user-profile/', views.RequestUserProfileAPIView.as_view(), name='request-user-profile'), # general any type of user role types
    path('update-request-user-profile/', views.UpdateRequestUserProfileAPIView.as_view(), name='update-request-user-profile'), # general any type of user role types

    # path('update-admin-profile/', views.UpdateRequestAdminProfileAPIView.as_view(), name='update-user-profile'),
    # path('update-buyer-profile/', views.UpdateRequestBuyerProfileAPIView.as_view(), name='update-user-profile'),

    
    # Forget-password
    path('password-reset-request/', views.PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/<uidb64>/<token>/', views.PasswordResetConfirm.as_view(), name='password-reset-confirm'),
    path('set-new-password/', views.SetNewPasswordView.as_view(), name='set-new-password'),
    # Change-password
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
]