from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from decimal import Decimal
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from .email_service import send_order_confirmation_email
from products.stock_service import StockService

class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete an order (Admin only)"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'pk'

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        print("=== ORDER CREATE REQUEST RECEIVED ===")
        print("Request data:", request.data)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        print("Validated data:", data)
        
        # Get values from request
        customer_name = data['customer_name']
        customer_email = data['customer_email']
        customer_phone = data.get('customer_phone', '')
        shipping_address = data['shipping_address']
        
        # Get subtotal, shipping_cost, total (use provided or calculate)
        subtotal = Decimal(str(data.get('subtotal', 0)))
        shipping_cost = Decimal(str(data.get('shipping_cost', 0)))
        total = Decimal(str(data.get('total', 0)))
        
        # If total is 0, calculate from items
        if total == 0:
            for item in data['items']:
                price = Decimal(str(item['product_price']))
                quantity = Decimal(str(item['quantity']))
                total += price * quantity
            subtotal = total
        
        print(f"Subtotal: {subtotal}, Shipping: {shipping_cost}, Total: {total}")
        
        # Create order
        order = Order.objects.create(
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            shipping_address=shipping_address,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            total=total,
            status='pending'
        )
        
        print(f"Order created: {order.id}")
        
        # Create order items
        order_items = []
        for item in data['items']:
            order_item = OrderItem.objects.create(
                order=order,
                product_name=item['product_name'],
                product_price=Decimal(str(item['product_price'])),
                quantity=int(item['quantity']),
                size=item.get('size', ''),
                color=item.get('color', '')
            )
            order_items.append(order_item)
        
        print(f"Created {len(order_items)} order items")
        
        # Send order confirmation email
        send_order_confirmation_email(order, order_items)
        
        # Clear cart after successful order
        session_key = request.session.session_key
        if session_key:
            try:
                from cart.models import Cart
                Cart.objects.filter(session_key=session_key).delete()
                print("Cart cleared")
            except Exception as e:
                print(f"Error clearing cart: {e}")
        
        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)