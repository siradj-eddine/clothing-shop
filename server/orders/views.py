from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from decimal import Decimal
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from .email_service import send_order_confirmation_email, send_order_status_email
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
    
    def update(self, request, *args, **kwargs):
        """Update order and send email notification"""
        instance = self.get_object()
        old_status = instance.status
        
        # Get the new status from request
        new_status = request.data.get('status')
        
        print(f"=== STATUS UPDATE: Order {instance.id} from {old_status} to {new_status} ===")
        
        # Update the order
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Send email if status changed
        if new_status and new_status != old_status:
            print(f"=== SENDING STATUS UPDATE EMAIL ===")
            send_order_status_email(instance, old_status, new_status)
        
        return Response(serializer.data)

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
        
        # Get subtotal, shipping_cost, total
        subtotal = Decimal(str(data.get('subtotal', 0)))
        shipping_cost = Decimal(str(data.get('shipping_cost', 0)))
        total = Decimal(str(data.get('total', 0)))
        
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
        
        # Create order items and prepare items_data for stock deduction
        order_items = []
        items_data = []
        
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
            
            # Add to items_data for stock deduction
            items_data.append({
                'product_id': item.get('product_id'),
                'quantity': int(item['quantity'])
            })
        
        print(f"Created {len(order_items)} order items")
        
        # ==========================================================
        # STOCK DEDUCTION - ADD THIS SECTION
        # ==========================================================
        stock_confirmed = StockService.confirm_stock_deduction(order, items_data)
        
        if not stock_confirmed:
            order.status = 'cancelled'
            order.save()
            return Response({'error': 'Stock unavailable. Order cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"Stock deducted successfully")
        # ==========================================================
        
        # Send order confirmation email
        send_order_confirmation_email(order, order_items)
        
        # Clear cart
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