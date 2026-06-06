from celery import shared_task
from django.core.mail import send_mail
from django.utils.html import strip_tags
from .email_templates import get_order_confirmation_email

@shared_task
def send_order_confirmation_email_async(order_id, order_items_data):
    """Send order confirmation email asynchronously"""
    from orders.models import Order, OrderItem
    
    try:
        order = Order.objects.get(id=order_id)
        order_items = OrderItem.objects.filter(order=order)
        
        html_content = get_order_confirmation_email(order, order_items)
        plain_text = strip_tags(html_content)
        
        send_mail(
            subject=f"Order Confirmation #{order.id} - Brother's Clothing",
            message=plain_text,
            from_email='siradjboulemaiz@gmail.com',
            recipient_list=[order.customer_email],
            html_message=html_content,
            fail_silently=False,
        )
        return f"Email sent for order {order_id}"
    except Exception as e:
        return f"Failed: {e}"