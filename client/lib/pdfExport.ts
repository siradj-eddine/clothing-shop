// This will only run on client side
let html2pdf: any = null;

// Dynamically import html2pdf only on client side
const loadHtml2Pdf = async () => {
  if (typeof window !== 'undefined' && !html2pdf) {
    const pdfModule = await import('html2pdf.js');
    html2pdf = pdfModule.default;
  }
  return html2pdf;
};

export const exportOrderToPDF = async (order: any, orderItems: any[]) => {
  const html2pdfLib = await loadHtml2Pdf();
  if (!html2pdfLib) {
    console.error('html2pdf not loaded');
    return;
  }

  const formatDA = (price: number): string => {
    return `${Math.round(price)} DZD`;
  };

  const element = document.createElement('div');
  element.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Order #${order.id} - Brother's Clothing Shop</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          padding: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #3B82F6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #3B82F6;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .order-info {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          border-left: 4px solid #3B82F6;
          padding-left: 10px;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background: #3B82F6;
          color: white;
        }
        .total-row {
          font-weight: bold;
          background: #f3f4f6;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-pending { background: #FEF3C7; color: #D97706; }
        .status-delivered { background: #D1FAE5; color: #059669; }
        .status-cancelled { background: #FEE2E2; color: #DC2626; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">👕 Brother's Clothing Shop</div>
        <p>Constantine, Nouvelle Ville, Algeria</p>
        <p>Email: siradjboulemaiz@gmail.com | Tel: 0782268236</p>
      </div>
      
      <div class="title">ORDER INVOICE</div>
      
      <div class="order-info">
        <table style="border: none;">
          <tr style="border: none;">
            <td style="border: none; width: 50%;"><strong>Order ID:</strong> #${order.id}</td>
            <td style="border: none;"><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</td>
          </tr>
          <tr style="border: none;">
            <td style="border: none;"><strong>Status:</strong> <span class="status status-${order.status}">${order.status.toUpperCase()}</span></td>
            <td style="border: none;"></td>
          </tr>
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">Customer Information</div>
        <table style="width: auto;">
          <tr><td style="border: none;"><strong>Name:</strong> ${order.customer_name}</td><td style="border: none;"><strong>Email:</strong> ${order.customer_email}</td></tr>
          <tr><td style="border: none;"><strong>Phone:</strong> ${order.customer_phone || 'N/A'}</td><td style="border: none;"></td></tr>
          <tr><td style="border: none;" colspan="2"><strong>Address:</strong> ${order.shipping_address}</td></tr>
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">Order Items</div>
        <table>
          <thead>
            <tr><th>Product</th><th>Size</th><th>Color</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${orderItems
              .map(
                (item: any) => `
              <tr>
                <td>${item.product_name}</td>
                <td>${item.size || '-'}</td>
                <td>${item.color || '-'}</td>
                <td>${item.quantity}</td>
                <td>${formatDA(parseFloat(item.product_price))}</td>
                <td>${formatDA(parseFloat(item.product_price) * item.quantity)}</td>
              </tr>
            `
              )
              .join('')}
            <tr class="total-row">
              <td colspan="5" style="text-align: right;"><strong>Total:</strong></td>
              <td><strong>${formatDA(parseFloat(order.total))}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="footer">
        <p>Thank you for shopping with us!</p>
        <p>This is a computer-generated invoice. No signature required.</p>
      </div>
    </body>
    </html>
  `;

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `Order_${order.id}_${order.customer_name}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, letterRendering: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  };

  html2pdfLib().set(opt).from(element).save();
};
