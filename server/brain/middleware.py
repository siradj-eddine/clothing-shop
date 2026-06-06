from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings
import time

class RateLimitMiddleware:
    """Redis-based sliding window rate limiting"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Skip rate limiting for admin and staff
        if request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser):
            return self.get_response(request)
        
        # Get client identifier (IP or user ID if logged in)
        if request.user.is_authenticated:
            client_id = f"user_{request.user.id}"
        else:
            client_id = f"ip_{self.get_client_ip(request)}"
        
        # Define rate limits (requests, window_seconds)
        rate_limits = {
            '/api/orders/create/': {'limit': 5, 'window': 60},    # 5 orders per minute
            '/api/cart/add/': {'limit': 20, 'window': 60},         # 20 cart adds per minute
            '/api/cart/update/': {'limit': 30, 'window': 60},      # 30 updates per minute
            '/api/token/': {'limit': 10, 'window': 60},            # 10 login attempts per minute
            '/api/products/': {'limit': 100, 'window': 60},        # 100 product views per minute
        }
        
        # Check if path needs rate limiting
        for path, config in rate_limits.items():
            if request.path.startswith(path):
                return self.check_rate_limit(client_id, path, config['limit'], config['window'], request)
        
        return self.get_response(request)
    
    def check_rate_limit(self, client_id, path, limit, window, request):
        """Sliding window rate limit using Redis"""
        cache_key = f'rate_limit:{client_id}:{path}'
        
        # Get current timestamp
        now = time.time()
        window_start = now - window
        
        # Get existing requests
        requests = cache.get(cache_key, [])
        
        # Clean old requests outside the window
        requests = [t for t in requests if t > window_start]
        
        # Check if over limit
        if len(requests) >= limit:
            oldest = min(requests) if requests else now
            retry_after = int(window - (now - oldest))
            response = JsonResponse({
                'error': f'Rate limit exceeded. Try again in {retry_after} seconds.',
                'limit': limit,
                'window': window,
                'retry_after': retry_after
            }, status=429)
            response['Retry-After'] = str(retry_after)
            return response
        
        # Add current request
        requests.append(now)
        cache.set(cache_key, requests, window)
        
        return self.get_response(request)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip