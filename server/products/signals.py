from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Product, Category

# Redis import - COMMENTED for Render free tier
# Uncomment when you upgrade to a paid plan with Redis
# from django_redis import get_redis_connection

@receiver([post_save, post_delete], sender=Product)
@receiver([post_save, post_delete], sender=Category)
def clear_all_cache(sender, instance, **kwargs):
    """Clear ALL cache when products or categories change"""
    
    # Clear default cache (always works)
    cache.clear()
    
    # ==========================================================
    # REDIS CACHE CLEARING - COMMENTED FOR FREE TIER
    # ==========================================================
    # When you upgrade to a paid Render plan with Redis,
    # uncomment the lines below to also clear Redis cache.
    #
    # try:
    #     redis_conn = get_redis_connection("default")
    #     redis_conn.flushall()
    #     print(f"✅ Redis cache cleared due to {sender.__name__} change")
    # except Exception as e:
    #     print(f"Redis not available: {e}")
    # ==========================================================
    
    print(f"✅ Cache cleared due to {sender.__name__} change")