from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags
from .email_templates import get_order_confirmation_email, get_order_status_email

def send_order_confirmation_email(order, order_items):
    """Send order confirmation email to customer"""
    print(f"=== EMAIL FUNCTION CALLED ===")
    print(f"Order ID: {order.id}")
    print(f"Customer Email: {order.customer_email}")
    print(f"Order Items: {len(order_items)}")
    
    try:
        print(f"Using EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
        print(f"Using DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
        
        html_content = get_order_confirmation_email(order, order_items)
        plain_text = strip_tags(html_content)
        
        result = send_mail(
            subject=f"Order Confirmation #{order.id} - Brother's Clothing",
            message=plain_text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.customer_email],
            html_message=html_content,
            fail_silently=False,
        )
        print(f"send_mail returned: {result}")
        print(f"✅ SUCCESS: Email sent to {order.customer_email}")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False