from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from django_redis import get_redis_connection
from .models import Product, Category

@receiver([post_save, post_delete], sender=Product)
@receiver([post_save, post_delete], sender=Category)
def clear_all_cache(sender, instance, **kwargs):
    """Clear ALL cache when products or categories change"""
    # Clear default cache
    cache.clear()
    
    # Clear Redis completely
    redis_conn = get_redis_connection("default")
    redis_conn.flushall()
    
    print(f"✅ Redis and cache completely cleared due to {sender.__name__} change")