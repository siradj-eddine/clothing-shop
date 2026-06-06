from django.urls import path
from .views import (
    ProductListView, ProductDetailView, CategoryListView,
    ProductCreateView, ProductUpdateView, ProductDeleteView,
    ProductImageUploadView, ProductImageView, SetMainImageView,
    CategoryCreateView, CategoryUpdateView, CategoryDeleteView, CategoryDetailView
)

urlpatterns = [
    # ==========================================================
    # 1. STATIC PATHS (no variables) - HIGHEST PRIORITY
    # ==========================================================
    
    # Category static paths
    path('categories/create/', CategoryCreateView.as_view(), name='category-create'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    
    # Product static paths
    path('create/', ProductCreateView.as_view(), name='product-create'),
    path('', ProductListView.as_view(), name='product-list'),  # Empty path must be last among static
    
    # Image static paths
    path('images/upload/', ProductImageUploadView.as_view(), name='product-image-upload'),
    
    # ==========================================================
    # 2. PATHS WITH INTEGER ID (more specific than slug)
    # ==========================================================
    path('images/<int:id>/', ProductImageView.as_view(), name='product-image-detail'),
    path('images/<int:image_id>/set-main/', SetMainImageView.as_view(), name='set-main-image'),
    
    # ==========================================================
    # 3. CATEGORY PATHS WITH SLUG
    # ==========================================================
    path('categories/<slug:slug>/update/', CategoryUpdateView.as_view(), name='category-update'),
    path('categories/<slug:slug>/delete/', CategoryDeleteView.as_view(), name='category-delete'),
    path('categories/<slug:slug>/', CategoryDetailView.as_view(), name='category-detail'),
    
    # ==========================================================
    # 4. PRODUCT PATHS WITH SLUG (MUST BE LAST - most dynamic)
    # ==========================================================
    path('<slug:slug>/update/', ProductUpdateView.as_view(), name='product-update'),
    path('<slug:slug>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
]