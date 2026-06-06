from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.translation import gettext_lazy as _

class ClothingShopAdminSite(AdminSite):
    site_header = "Brother's Clothing Shop"
    site_title = "Admin Dashboard"
    index_title = "Welcome to Your Shop Dashboard"
    
    def get_app_list(self, request):
        """Custom order of apps in admin"""
        app_list = super().get_app_list(request)
        
        # Custom ordering
        custom_order = ['products', 'orders', 'cart']
        
        for app in app_list:
            if app['app_label'] in custom_order:
                app['name'] = self.get_custom_app_name(app['app_label'])
        
        return app_list
    
    def get_custom_app_name(self, app_label):
        names = {
            'products': '📦 Product Management',
            'orders': '📋 Order Management',
            'cart': '🛒 Shopping Carts',
        }
        return names.get(app_label, app_label.capitalize())

# Register custom admin site (optional - use default or custom)
# admin_site = ClothingShopAdminSite(name='clothing_admin')