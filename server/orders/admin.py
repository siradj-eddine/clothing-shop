from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'product_price', 'quantity']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'customer_email', 'total', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['customer_name', 'customer_email']
    readonly_fields = ['total', 'created_at']
    inlines = [OrderItemInline]
    
    actions = ['mark_as_paid', 'mark_as_shipped', 'mark_as_delivered']
    
    def mark_as_paid(self, request, queryset):
        queryset.update(status='paid')
    mark_as_paid.short_description = 'Mark as Paid'
    
    def mark_as_shipped(self, request, queryset):
        queryset.update(status='shipped')
    mark_as_shipped.short_description = 'Mark as Shipped'
    
    def mark_as_delivered(self, request, queryset):
        queryset.update(status='delivered')
    mark_as_delivered.short_description = 'Mark as Delivered'