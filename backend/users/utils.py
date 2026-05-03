import random
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.http import Http404, HttpResponse, JsonResponse
from django.contrib.auth import get_user_model

from rest_framework import status

from .models import UserOTP   
    
    

# resend a new otp to email
def modifySendOTPToEmail(request, email):
    print('email=', email)
    try:
        user = get_user_model().objects.get(email=email)
        print("user=", user)
        otp = random.randint(1000, 9999) 
        # Check if an OTP record already exists for the user
        otp_user, created = UserOTP.objects.get_or_create(user=user)
        otp_user.otp = otp  # Update the OTP value
        otp_user.save()  # Save the updated OTP record

        # Send the created,updated otp to user.email
        subject = "One time passcode for Email verification"
        current_site = get_current_site(request).domain
        body = f"Hi {user.first_name} thanks for signing up on {current_site}, please verify your email with the one time passcode:\n \n {otp}"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [user.email]
        EM = EmailMessage(subject=subject, body=body, from_email=from_email, to=to )
        EM.send()

        return JsonResponse({
            'user': user.email,
            'register_message': 'Thanks for signing up. OTP has been sent to your email to verify your email.'
        }, status=201)
    
    except get_user_model().DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)    
    
    
    
    
    
# send email link for Password Reset Request
def send_normal_email(data):
    email=EmailMessage(
                        subject    =data['email_subject'],
                        body       =data['email_body'],
                        from_email =settings.DEFAULT_FROM_EMAIL,
                        to         =[data['to_email']]
    )
    email.send()


   
#  modify  random otp object and send it to user email ####
# def send_generated_otp_to_email(request,email): 
#     print('email=', email)
#     user = get_user_model().objects.filter(email=email)
#     print("user=", user)
#     if user.exists():
#         # modify random otp
#         otp=random.randint(1000, 9999) 
#         #  create user otp object - and save it in UserOTP model 
#         otp_user= UserOTP.objects.create(user=user, otp=otp)
#         ## send the otp to user email  
#         subject      = "One time passcode for Email verification"
#         current_site = get_current_site(request).domain
#         body         = f"Hi {user.first_name} thanks for signing up on {current_site},please verify your email with the one time passcode:\n \n {otp}"
#         from_email   = settings.DEFAULT_FROM_EMAIL
#         to           = [user.email] 
#         EM           = EmailMessage(subject=subject, body=body, from_email=from_email, to=to)
#         EM.send()

