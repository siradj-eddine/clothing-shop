export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact customer service. This may include your name, email address, shipping address, and payment information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">How We Use Your Information</h2>
          <p>We use your information to process orders, communicate with you about your order, and improve our services. We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Security</h2>
          <p>We implement appropriate security measures to protect your personal information. All payment information is encrypted using SSL technology.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Cookies</h2>
          <p>We use cookies to enhance your browsing experience and analyze site traffic. You can disable cookies in your browser settings.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h2>
          <p>If you have questions about this privacy policy, please contact us at privacy@brothershop.com</p>
        </section>
      </div>
    </div>
  );
}