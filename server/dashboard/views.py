from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from orders.models import Order, OrderItem
from products.models import Product, Category

class DashboardStatsView(APIView):
    """Return JSON data for admin dashboard"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Order statistics
        total_orders = Order.objects.count()
        paid_orders = Order.objects.filter(status='paid').count()
        pending_orders = Order.objects.filter(status='pending').count()
        delivered_orders = Order.objects.filter(status='delivered').count()
        cancelled_orders = Order.objects.filter(status='cancelled').count()
        
        # Revenue using SUBTOTAL (without shipping)
        total_revenue = Order.objects.filter(status='paid').aggregate(total=Sum('subtotal'))['total'] or 0
        weekly_revenue = Order.objects.filter(created_at__gte=week_ago, status='paid').aggregate(total=Sum('subtotal'))['total'] or 0
        monthly_revenue = Order.objects.filter(created_at__gte=month_ago, status='paid').aggregate(total=Sum('subtotal'))['total'] or 0
        
        # Weekly and monthly orders count
        weekly_orders = Order.objects.filter(created_at__gte=week_ago).count()
        monthly_orders = Order.objects.filter(created_at__gte=month_ago).count()
        
        # Product statistics
        total_products = Product.objects.count()
        active_products = Product.objects.filter(is_active=True).count()
        low_stock_products = Product.objects.filter(stock__lt=10, is_active=True).count()
        out_of_stock_products = Product.objects.filter(stock=0, is_active=True).count()
        total_categories = Category.objects.count()
        
        # Top selling products using OrderItem
        top_products = []
        try:
            top_products_list = OrderItem.objects.values('product_name').annotate(
                total_sold=Sum('quantity')
            ).order_by('-total_sold')[:5]
            
            for item in top_products_list:
                top_products.append({
                    'name': item['product_name'],
                    'total_sold': item['total_sold'],
                })
        except:
            pass
        
        # Daily data for charts (last 7 days)
        daily_data = []
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            # Convert to timezone-aware datetime
            start_date = timezone.make_aware(timezone.datetime.combine(date, timezone.datetime.min.time()))
            end_date = timezone.make_aware(timezone.datetime.combine(date + timedelta(days=1), timezone.datetime.min.time()))
            
            daily_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'orders': Order.objects.filter(created_at__range=(start_date, end_date)).count(),
                'revenue': float(Order.objects.filter(
                    created_at__range=(start_date, end_date), 
                    status='paid'
                ).aggregate(total=Sum('subtotal'))['total'] or 0)
            })
        
        # Recent orders
        recent_orders = Order.objects.order_by('-created_at')[:10].values(
            'id', 'customer_name', 'customer_email', 'total', 'status', 'created_at'
        )
        
        # Convert Decimal to float for JSON serialization
        for order in recent_orders:
            order['total'] = float(order['total']) if order['total'] else 0
        
        return Response({
            'success': True,
            'data': {
                'orders': {
                    'total': total_orders,
                    'paid': paid_orders,
                    'pending': pending_orders,
                    'delivered': delivered_orders,
                    'cancelled': cancelled_orders,
                },
                'revenue': {
                    'total': float(total_revenue),
                    'weekly': float(weekly_revenue),
                    'monthly': float(monthly_revenue),
                },
                'products': {
                    'total': total_products,
                    'active': active_products,
                    'low_stock': low_stock_products,
                    'out_of_stock': out_of_stock_products,
                    'categories': total_categories,
                },
                'charts': {
                    'weekly_orders': weekly_orders,
                    'monthly_orders': monthly_orders,
                    'last_7_days': daily_data,
                },
                'top_products': top_products,
                'recent_orders': list(recent_orders),
            }
        })