# users/authentication.py

#  rest_framework
from rest_framework.exceptions import AuthenticationFailed
# https://github.com/jazzband/djangorestframework-simplejwt/blob/master/rest_framework_simplejwt/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieCustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        
        # If Authorization header exists, defer to JWTAuthentication (for Swagger or Postman)
        header = self.get_header(request)
        if header is not None:
            return super().authenticate(request)

        # If no access token in cookies, skip authentication silently
        token = request.COOKIES.get("access_token")
        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
        except Exception as e:
            # Return None instead of raising exception → this avoids 401 for AllowAny views
            return None

        try:
            user = self.get_user(validated_token)
            return user, validated_token
        except Exception as e:
            return None
