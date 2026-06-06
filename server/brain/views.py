from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .jwt_blacklist import JWTBlacklist

class LogoutView(APIView):
    """Logout user by blacklisting their token"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Get the token from the request
            auth_header = request.headers.get('Authorization', '')
            if auth_header.startswith('Bearer '):
                token_str = auth_header.split(' ')[1]
                JWTBlacklist.blacklist_access_token(token_str)
            
            return Response(
                {"message": "Successfully logged out"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class LogoutAllView(APIView):
    """Logout user from all devices"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Blacklist all tokens for this user
            JWTBlacklist.logout_user(request.user.id)
            return Response(
                {"message": "Logged out from all devices"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )