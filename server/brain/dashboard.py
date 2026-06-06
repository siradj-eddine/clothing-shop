from django.contrib.admin import AdminSite
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

class ClothingShopAdminSite(AdminSite):
    site_header = "Brother's Clothing Shop"
    site_title = "Admin Dashboard"
    index_title = "Dashboard"
    
    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        return app_list
    
    def index(self, request, extra_context=None):
        from orders.models import Order
        from products.models import Product
        
        # Get statistics
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        stats = {
            'total_orders': Order.objects.count(),
            'pending_orders': Order.objects.filter(status='pending').count(),
            'paid_orders': Order.objects.filter(status='paid').count(),
            'shipped_orders': Order.objects.filter(status='shipped').count(),
            'delivered_orders': Order.objects.filter(status='delivered').count(),
            'total_revenue': Order.objects.filter(status='paid').aggregate(total=Sum('total'))['total'] or 0,
            'weekly_orders': Order.objects.filter(created_at__gte=week_ago).count(),
            'monthly_orders': Order.objects.filter(created_at__gte=month_ago).count(),
            'total_products': Product.objects.count(),
            'low_stock': Product.objects.filter(stock__lt=10).count(),
            'out_of_stock': Product.objects.filter(stock=0).count(),
        }
        
        extra_context = extra_context or {}
        extra_context['stats'] = stats
        return super().index(request, extra_context)

# Uncomment to use custom admin site
# admin_site = ClothingShopAdminSite(name='clothing_admin')