def get_order_confirmation_email(order, order_items):
    """Generate order confirmation email HTML"""
    
    items_html = ""
    for item in order_items:
        items_html += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{item.product_name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{float(item.product_price):.0f} DZD</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{float(item.product_price) * item.quantity:.0f} DZD</td>
        </tr>
        """
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; }}
            .order-details {{ background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th {{ background-color: #f0f0f0; padding: 10px; text-align: left; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Thank You for Your Order! 🎉</h1>
            </div>
            <div class="content">
                <p>Dear <strong>{order.customer_name}</strong>,</p>
                <p>Your order has been received and is now being processed.</p>
                
                <div class="order-details">
                    <h3>Order Information</h3>
                    <p><strong>Order ID:</strong> #{order.id}</p>
                    <p><strong>Order Date:</strong> {order.created_at.strftime('%B %d, %Y at %H:%M')}</p>
                    <p><strong>Status:</strong> Pending</p>
                </div>
                
                <h3>Order Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                </table>
                
                <div style="text-align: right; margin-top: 20px;">
                    <h3>Total: {float(order.total):.0f} DZD</h3>
                </div>
                
                <div class="order-details">
                    <h3>Shipping Information</h3>
                    <p><strong>Address:</strong> {order.shipping_address}</p>
                </div>
                
                <p>Thank you for shopping with us!</p>
            </div>
            <div class="footer">
                <p>© 2026 Brother's Clothing Shop. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

def get_order_status_email(order, old_status, new_status):
    """Generate order status update email HTML"""
    
    status_messages = {
        'paid': '✅ Your payment has been confirmed! We are processing your order.',
        'delivered': '📦 Your order has been delivered! We hope you enjoy your purchase.',
        'cancelled': '❌ Your order has been cancelled as requested.',
    }
    
    status_titles = {
        'paid': 'Payment Confirmed',
        'delivered': 'Order Delivered',
        'cancelled': 'Order Cancelled',
    }
    
    message = status_messages.get(new_status, f'Your order status has been updated to {new_status}.')
    title = status_titles.get(new_status, 'Order Status Update')
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>{title} - Brother's Clothing Shop</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .status {{ display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin: 10px 0; }}
            .status-paid {{ background: #10B981; color: white; }}
            .status-delivered {{ background: #3B82F6; color: white; }}
            .status-cancelled {{ background: #EF4444; color: white; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{title}</h1>
            </div>
            <div class="content">
                <p>Dear <strong>{order.customer_name}</strong>,</p>
                <p>{message}</p>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3>Order #{order.id} Details</h3>
                    <p><strong>Status:</strong> <span class="status status-{new_status}">{new_status.upper()}</span></p>
                    <p><strong>Order Date:</strong> {order.created_at.strftime('%B %d, %Y')}</p>
                    <p><strong>Total Amount:</strong> {float(order.total):.0f} DZD</p>
                </div>
                
                <p>If you have any questions, please contact our customer support.</p>
                <p>Thank you for shopping with us!</p>
            </div>
            <div class="footer">
                <p>© 2026 Brother's Clothing Shop. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """