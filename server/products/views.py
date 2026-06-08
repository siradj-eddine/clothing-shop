from rest_framework import generics, filters, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from .models import Product, Category, ProductImage
from .serializers import (
    CategoryDetailSerializer, ProductSerializer, CategorySerializer, 
    ProductImageSerializer, CategoryCreateUpdateSerializer
)

# ==========================================================
# PAGINATION
# ==========================================================

class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

# ==========================================================
# PRODUCT PUBLIC ENDPOINTS (CACHED)
# ==========================================================

class ProductListView(generics.ListAPIView):
    """List all active products with pagination - CACHED"""
    queryset = Product.objects.filter(is_active=True).select_related(
        'category'
    ).prefetch_related('images')
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class ProductDetailView(generics.RetrieveAPIView):
    """Get single product by slug - CACHED"""
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# ==========================================================
# CATEGORY PUBLIC ENDPOINTS (CACHED)
# ==========================================================

class CategoryListView(generics.ListAPIView):
    """List all categories - CACHED"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    
    @method_decorator(cache_page(60 * 30))  # Cache for 30 minutes
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class CategoryDetailView(generics.RetrieveAPIView):
    """Get category details with products"""
    queryset = Category.objects.all().prefetch_related('products')
    serializer_class = CategoryDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ==========================================================
# PRODUCT ADMIN ENDPOINTS (No cache - real-time)
# ==========================================================

class ProductCreateView(generics.CreateAPIView):
    """Create a new product (Admin only)"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save()
        # Clear cache after creating product
        cache.delete_pattern('*.views.decorators.cache.*')

class ProductUpdateView(generics.UpdateAPIView):
    """Update a product (Admin only)"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'
    
    def perform_update(self, serializer):
        serializer.save()
        # Clear cache after updating product
        cache.delete_pattern('*.views.decorators.cache.*')

class ProductDeleteView(generics.DestroyAPIView):
    """Delete a product (Admin only)"""
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'
    
    def perform_destroy(self, instance):
        instance.delete()
        # Clear cache after deleting product
        cache.delete_pattern('*.views.decorators.cache.*')

# ==========================================================
# IMAGE UPLOAD ENDPOINTS
# ==========================================================

class ProductImageUploadView(generics.CreateAPIView):
    """Upload image for a product (Admin only)"""
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        product = get_object_or_404(Product, id=product_id)
        serializer.save(product=product)

class ProductImageView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a product image (Admin only)"""
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

class SetMainImageView(APIView):
    """Set an image as the main product image (Admin only)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request, image_id):
        image = get_object_or_404(ProductImage, id=image_id)
        
        # Remove main flag from all images of this product
        image.product.images.all().update(is_main=False)
        
        # Set this image as main
        image.is_main = True
        image.save()
        
        serializer = ProductImageSerializer(image)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ==========================================================
# CATEGORY ADMIN ENDPOINTS
# ==========================================================

class CategoryCreateView(generics.CreateAPIView):
    """Create a new category (Admin only)"""
    queryset = Category.objects.all()
    serializer_class = CategoryCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save()
        cache.delete_pattern('*.views.decorators.cache.*')

class CategoryUpdateView(generics.UpdateAPIView):
    """Update a category (Admin only)"""
    queryset = Category.objects.all()
    serializer_class = CategoryCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'
    
    def perform_update(self, serializer):
        serializer.save()
        cache.delete_pattern('*.views.decorators.cache.*')

class CategoryDeleteView(generics.DestroyAPIView):
    """Delete a category (Admin only)"""
    queryset = Category.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'
    
    def perform_destroy(self, instance):
        instance.delete()
        cache.delete_pattern('*.views.decorators.cache.*')