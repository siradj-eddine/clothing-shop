from django.core.cache import cache
from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.conf import settings

class JWTBlacklist:
    """Redis-based blacklist for JWT tokens"""
    
    @staticmethod
    def blacklist_access_token(token_str):
        """Add access token to blacklist"""
        try:
            token = AccessToken(token_str)
            exp_timestamp = token.payload.get('exp', 0)
            # Calculate remaining lifetime
            remaining_seconds = max(exp_timestamp - datetime.now().timestamp(), 0)
            
            # Store in Redis with TTL
            cache_key = f"blacklist_access_{token_str[:50]}"
            cache.set(cache_key, "revoked", timeout=int(remaining_seconds))
            return True
        except Exception:
            return False
    
    @staticmethod
    def blacklist_refresh_token(token_str):
        """Add refresh token to blacklist"""
        try:
            token = RefreshToken(token_str)
            exp_timestamp = token.payload.get('exp', 0)
            remaining_seconds = max(exp_timestamp - datetime.now().timestamp(), 0)
            
            cache_key = f"blacklist_refresh_{token_str[:50]}"
            cache.set(cache_key, "revoked", timeout=int(remaining_seconds))
            return True
        except Exception:
            return False
    
    @staticmethod
    def is_access_blacklisted(token_str):
        """Check if access token is blacklisted"""
        cache_key = f"blacklist_access_{token_str[:50]}"
        return cache.get(cache_key) is not None
    
    @staticmethod
    def is_refresh_blacklisted(token_str):
        """Check if refresh token is blacklisted"""
        cache_key = f"blacklist_refresh_{token_str[:50]}"
        return cache.get(cache_key) is not None
    
    @staticmethod
    def logout_user(user_id):
        """Blacklist all tokens for a user (force logout from all devices)"""
        cache_key = f"user_blacklist_{user_id}"
        # Store user blacklist entry
        cache.set(cache_key, "blocked", timeout=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'])
        return True
    
    @staticmethod
    def is_user_blacklisted(user_id, token_str):
        """Check if user is globally blacklisted"""
        cache_key = f"user_blacklist_{user_id}"
        if cache.get(cache_key):
            return True
        return JWTBlacklist.is_access_blacklisted(token_str)