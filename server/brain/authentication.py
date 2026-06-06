from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from .jwt_blacklist import JWTBlacklist

class CustomJWTAuthentication(JWTAuthentication):
    """Custom JWT authentication that checks blacklist"""
    
    def authenticate(self, request):
        result = super().authenticate(request)
        if result is None:
            return None
        
        user, token = result
        
        # Check if token is blacklisted
        token_str = str(token)
        if JWTBlacklist.is_access_blacklisted(token_str):
            raise AuthenticationFailed('Token has been revoked')
        
        # Check if user is globally blacklisted
        if JWTBlacklist.is_user_blacklisted(user.id, token_str):
            raise AuthenticationFailed('User has been blocked')
        
        return (user, token)