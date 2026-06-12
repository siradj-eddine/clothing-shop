class CacheManager:
    """Centralized cache management for products and categories"""
    
    @staticmethod
    def invalidate_all():
        """Invalidate ALL cache (products + categories)"""
        try:
            # Clear all cache instead of incrementing version
            cache.clear()
            print("✅ ALL cache cleared (products + categories + homepage)")
        except Exception as e:
            print(f"Cache error: {e}")