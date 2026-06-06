from rest_framework import serializers
from decimal import Decimal
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_price', 'quantity', 'size', 'color']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_email', 'customer_phone',
            'shipping_address', 'subtotal', 'shipping_cost', 'total', 
            'status', 'items', 'created_at'
        ]

class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=200)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    shipping_address = serializers.CharField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    shipping_cost = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    items = serializers.ListField(child=serializers.DictField())
    
    def validate_items(self, value):
        for item in value:
            if 'product_name' not in item:
                raise serializers.ValidationError("Each item must have a product_name")
            if 'product_price' not in item:
                raise serializers.ValidationError("Each item must have a product_price")
            if 'quantity' not in item:
                raise serializers.ValidationError("Each item must have a quantity")
            
            try:
                Decimal(str(item['product_price']))
            except:
                raise serializers.ValidationError(f"Invalid price: {item['product_price']}")
            
            try:
                qty = int(item['quantity'])
                if qty <= 0:
                    raise serializers.ValidationError("Quantity must be greater than 0")
            except:
                raise serializers.ValidationError(f"Invalid quantity: {item['quantity']}")
        
        return value