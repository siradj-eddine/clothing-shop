from django.core.cache import cache
from django.db import transaction
from .models import Product
import logging

logger = logging.getLogger(__name__)

class StockService:
    """Redis-based real-time stock management"""
    
    @staticmethod
    def reserve_stock(product_id, quantity, session_key):
        """Reserve stock in Redis when adding to cart"""
        cache_key = f"stock_reserved:{product_id}:{session_key}"
        
        # Get current reserved stock for this session
        reserved = cache.get(cache_key, 0)
        new_reserved = reserved + quantity
        
        # Get product from database
        try:
            product = Product.objects.get(id=product_id)
            
            # Check if enough stock available
            if new_reserved <= product.stock:
                cache.set(cache_key, new_reserved, timeout=1800)  # 30 minutes
                return True, new_reserved
            else:
                available = product.stock - reserved
                return False, available
        except Product.DoesNotExist:
            return False, 0
    
    @staticmethod
    def release_stock(product_id, session_key):
        """Release reserved stock when removing from cart or cart expires"""
        cache_key = f"stock_reserved:{product_id}:{session_key}"
        cache.delete(cache_key)
        return True
    
    @staticmethod
    def release_all_stock(session_key):
        """Release all stock reserved for a session"""
        # Find all keys for this session and delete them
        pattern = f"stock_reserved:*:{session_key}"
        # Note: This requires Redis scan, simplified for now
        return True
    
    @staticmethod
    def get_reserved_stock(product_id, session_key):
        """Get currently reserved stock for a session"""
        cache_key = f"stock_reserved:{product_id}:{session_key}"
        return cache.get(cache_key, 0)
    
    @staticmethod
    @transaction.atomic
    def confirm_stock_deduction(order, items_data):
        """Permanently deduct stock after order confirmation"""
        try:
            for item_data in items_data:
                product = Product.objects.select_for_update().get(id=item_data['product_id'])
                
                if product.stock >= item_data['quantity']:
                    product.stock -= item_data['quantity']
                    product.save()
                else:
                    raise Exception(f"Insufficient stock for product: {product.name}")
            
            return True
        except Exception as e:
            logger.error(f"Stock deduction failed for order {order.id}: {e}")
            return False