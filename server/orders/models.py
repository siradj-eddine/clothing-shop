from django.db import models

class Order(models.Model):
    STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('paid', 'Paid'),
    ('delivered', 'Delivered'),
    ('cancelled', 'Cancelled'),
]
    
    # Customer info
    customer_name = models.CharField(max_length=200, db_index=True)
    customer_email = models.EmailField(db_index=True)
    customer_phone = models.CharField(max_length=20, blank=True)
    shipping_address = models.TextField()
    
    # Order details
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['customer_email']),
            models.Index(fields=['created_at']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['customer_email', 'status']),
            models.Index(fields=['created_at', 'status']),
        ]
    
    def __str__(self):
        return f"Order {self.id} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE, 
        related_name='items',
        db_index=True
    )
    
    # Product snapshot
    product_name = models.CharField(max_length=200)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    
    # Options
    size = models.CharField(max_length=10, blank=True, db_index=True)
    color = models.CharField(max_length=50, blank=True, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['size']),
            models.Index(fields=['color']),
            models.Index(fields=['order', 'size']),
            models.Index(fields=['order', 'color']),
        ]
    
    def __str__(self):
        return f"{self.quantity}x {self.product_name}"