from rest_framework import serializers
from .models import Category, Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image', 'image_url', 'is_main', 'sort_order']
    
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    main_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price',
            'category', 'category_name', 'stock', 'sizes', 'colors',
            'is_active', 'images', 'main_image_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_main_image_url(self, obj):
        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            return main_image.image.url
        first_image = obj.images.first()
        if first_image:
            return first_image.image.url
        return None

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'product_count']
    
    def get_product_count(self, obj):
        if hasattr(obj, '_prefetched_objects_cache') and 'products' in obj._prefetched_objects_cache:
            return obj.products.filter(is_active=True).count()
        return obj.products.filter(is_active=True).count()

class CategoryDetailSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'product_count', 'products', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_product_count(self, obj):
        if hasattr(obj, '_prefetched_objects_cache') and 'products' in obj._prefetched_objects_cache:
            return obj.products.filter(is_active=True).count()
        return obj.products.filter(is_active=True).count()

class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'slug']
    
    def validate_slug(self, value):
        instance = self.instance
        if Category.objects.filter(slug=value).exists():
            if not instance or instance.slug != value:
                raise serializers.ValidationError("Category with this slug already exists.")
        return value