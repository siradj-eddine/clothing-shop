from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['slug']),
        ]
    
    def __str__(self):
        return self.name

class Product(models.Model):
    # Basic info
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    
    # Relationships
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='products',
        db_index=True
    )
    
    # Inventory
    stock = models.IntegerField(default=0, db_index=True)
    
    # Sizes as JSON (multiple sizes)
    sizes = models.JSONField(default=list, blank=True, help_text="e.g., ['S', 'M', 'L']")
    colors = models.JSONField(default=list, blank=True, help_text="e.g., ['Red', 'Blue', 'Black']")
    
    # Status
    is_active = models.BooleanField(default=True, db_index=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['price']),
            models.Index(fields=['stock']),
            models.Index(fields=['is_active']),
            models.Index(fields=['created_at']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['is_active', 'price']),
            models.Index(fields=['is_active', 'created_at']),
        ]
    
    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='images',
        db_index=True
    )
    image = models.ImageField(upload_to='products/')
    is_main = models.BooleanField(default=False, db_index=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['sort_order', 'created_at']
        indexes = [
            models.Index(fields=['product', 'is_main']),
            models.Index(fields=['product', 'sort_order']),
            models.Index(fields=['is_main']),
        ]
    
    def __str__(self):
        return f"{self.product.name} - Image {self.sort_order}"