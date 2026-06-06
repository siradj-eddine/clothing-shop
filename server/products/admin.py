from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Category, Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image_preview', 'image', 'is_main', 'sort_order']
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = 20

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'thumbnail', 'name', 'price', 'stock', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']  # Removed 'size'
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'stock', 'is_active']
    list_per_page = 20
    date_hierarchy = 'created_at'
    save_on_top = True
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'category')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'stock', 'sizes', 'colors')
        }),
        ('Images', {
            'fields': ('images_preview',),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at', 'images_preview']
    inlines = [ProductImageInline]
    
    def thumbnail(self, obj):
        main_image = obj.images.filter(is_main=True).first()
        if main_image and main_image.image:
            return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />', main_image.image.url)
        return "📷"
    thumbnail.short_description = ''
    
    def images_preview(self, obj):
        images = obj.images.all()[:5]
        if not images:
            return "No images uploaded"
        
        html = '<div style="display: flex; gap: 5px; flex-wrap: wrap;">'
        for img in images:
            if img.image:
                html += f'<img src="{img.image.url}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />'
        html += '</div>'
        return format_html(html)
    images_preview.short_description = 'Product Images'

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'product_name', 'image_preview', 'is_main', 'sort_order']
    list_filter = ['is_main', 'product']
    list_editable = ['is_main', 'sort_order']
    search_fields = ['product__name']
    list_per_page = 30
    
    def product_name(self, obj):
        return obj.product.name
    product_name.short_description = 'Product'
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'