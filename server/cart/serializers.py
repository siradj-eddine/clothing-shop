from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', read_only=True, max_digits=10, decimal_places=2)
    product_image = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'product_price', 'product_image', 
                  'quantity', 'size', 'color', 'subtotal']
    
    def get_product_image(self, obj):
        main_image = obj.product.images.filter(is_main=True).first()
        if main_image:
            return main_image.image.url
        first_image = obj.product.images.first()
        if first_image:
            return first_image.image.url
        return None
    
    def get_subtotal(self, obj):
        return float(obj.product.price) * obj.quantity

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    size = serializers.CharField(max_length=10, required=False, allow_blank=True)
    color = serializers.CharField(max_length=50, required=False, allow_blank=True)

class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=0)

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    total_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'session_key', 'items', 'total', 'total_items', 'created_at', 'updated_at']
    
    def get_total(self, obj):
        return sum(float(item.product.price) * item.quantity for item in obj.items.all())
    
    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())