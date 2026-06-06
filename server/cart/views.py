from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer
from products.stock_service import StockService
def get_or_create_cart(request):
    """Get or create cart using Django session"""
    
    # Get or create session key
    if not request.session.session_key:
        request.session.create()
    
    session_key = request.session.session_key
    
    # Get or create cart for this session
    cart, created = Cart.objects.get_or_create(session_key=session_key)
    
    return cart

class CartView(APIView):
    """Get current cart"""
    
    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddToCartView(APIView):
    """Add product to cart with stock reservation"""
    
    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart = get_or_create_cart(request)
        product = get_object_or_404(Product, id=serializer.validated_data['product_id'])
        
        if not product.is_active:
            return Response({'error': 'Product is not available'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if enough stock available
        quantity = serializer.validated_data['quantity']
        session_key = request.session.session_key
        
        # Reserve stock in Redis
        reserved, available = StockService.reserve_stock(product.id, quantity, session_key)
        
        if not reserved:
            return Response({
                'error': f'Only {available} units available in stock'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create cart item
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=serializer.validated_data.get('size', ''),
            color=serializer.validated_data.get('color', ''),
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)
    
class UpdateCartItemView(APIView):
    """Update cart item quantity"""
    
    def put(self, request, item_id):
        print(f"=== UPDATE VIEW CALLED with item_id: {item_id} ===")
        
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart = get_or_create_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        
        if serializer.validated_data['quantity'] <= 0:
            cart_item.delete()
        else:
            cart_item.quantity = serializer.validated_data['quantity']
            cart_item.save()
        
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)

class RemoveFromCartView(APIView):
    """Remove item from cart and release stock"""
    
    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        
        # Release reserved stock
        session_key = request.session.session_key
        StockService.release_stock(cart_item.product.id, session_key)
        
        cart_item.delete()
        
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)

class ClearCartView(APIView):
    """Clear entire cart and release all stock"""
    
    def delete(self, request):
        cart = get_or_create_cart(request)
        
        # Release all stock for this session
        session_key = request.session.session_key
        for item in cart.items.all():
            StockService.release_stock(item.product.id, session_key)
        
        cart.items.all().delete()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)
    



