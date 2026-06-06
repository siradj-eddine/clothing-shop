export default function ShippingReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shipping & Returns</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Shipping Policy</h2>
          <div className="space-y-3 text-gray-600">
            <p>We offer free standard shipping on all orders over $100 within the continental United States.</p>
            <p>Standard Shipping (5-7 business days): $5.99</p>
            <p>Express Shipping (2-3 business days): $12.99</p>
            <p>Overnight Shipping (1-2 business days): $24.99</p>
            <p className="mt-4">Orders are processed within 1-2 business days. You will receive a tracking number once your order ships.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
          <div className="space-y-3 text-gray-600">
            <p>We want you to love your purchase. If you're not completely satisfied, you may return unworn, unwashed items within 30 days of delivery for a full refund.</p>
            <p>To be eligible for a return:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Items must be unworn and unwashed</li>
              <li>Original tags must still be attached</li>
              <li>Items must be in original packaging</li>
            </ul>
            <p className="mt-4">To initiate a return, please contact our customer service team at returns@brothershop.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Refunds</h2>
          <p className="text-gray-600">Once we receive your return, we will inspect the item and process your refund within 5-7 business days. Refunds will be issued to your original payment method.</p>
        </section>
      </div>
    </div>
  );
}