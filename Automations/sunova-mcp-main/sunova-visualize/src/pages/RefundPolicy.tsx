import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1 className="font-display text-4xl font-bold gradient-text mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. General Refund Policy</h2>
            <p className="text-muted-foreground mb-4">
              Due to the nature of our AI-powered service and the immediate costs incurred when processing your 
              requests through third-party APIs, we generally cannot offer refunds for purchases made on SuNova. 
              The computational resources and API costs are consumed at the time of generation and cannot be recovered.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Why Refunds Are Limited</h2>
            <p className="text-muted-foreground mb-4">
              When you use SuNova to generate a music video, we immediately incur costs for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>AI model processing and inference</li>
              <li>Video generation and rendering</li>
              <li>Cloud storage and bandwidth</li>
              <li>Third-party API usage</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              These costs are paid by us in real-time and are non-recoverable, which is why we cannot provide 
              refunds once credits have been used or services have been rendered.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Exceptional Circumstances</h2>
            <p className="text-muted-foreground mb-4">
              Refunds may be considered at admin discretion in the following exceptional circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li><strong>Accidental Duplicate Purchases:</strong> If you accidentally purchased the same plan or credits multiple times</li>
              <li><strong>Technical Failures:</strong> If our service failed to deliver any output due to a system error on our end</li>
              <li><strong>Billing Errors:</strong> If you were incorrectly charged due to a system malfunction</li>
              <li><strong>Service Unavailability:</strong> If the service was completely unavailable after purchase and before any usage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Non-Refundable Situations</h2>
            <p className="text-muted-foreground mb-4">
              Refunds will not be provided in the following situations:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Dissatisfaction with generated content quality or creative output</li>
              <li>Change of mind after credits have been used</li>
              <li>Unused credits or subscription time (credits do not expire but are non-refundable)</li>
              <li>User error in uploading incorrect files or settings</li>
              <li>Incompatibility with user's source material or expectations</li>
              <li>Third-party service interruptions beyond our control</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. How to Request a Refund</h2>
            <p className="text-muted-foreground mb-4">
              If you believe you qualify for a refund under exceptional circumstances, please contact us at 
              hello@sunova.ai within 7 days of your purchase with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Your account email address</li>
              <li>Transaction ID or purchase details</li>
              <li>Detailed explanation of the issue</li>
              <li>Any relevant screenshots or documentation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Review Process</h2>
            <p className="text-muted-foreground mb-4">
              All refund requests are reviewed on a case-by-case basis by our admin team. We typically respond 
              within 3-5 business days. If approved, refunds are processed to the original payment method within 
              5-10 business days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Chargebacks</h2>
            <p className="text-muted-foreground mb-4">
              Please contact us directly before initiating a chargeback with your payment provider. Chargebacks 
              may result in immediate account suspension and may prevent future access to our services. We are 
              committed to resolving issues fairly and directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Questions</h2>
            <p className="text-muted-foreground">
              If you have questions about our refund policy or believe you have a valid case for a refund, 
              please don't hesitate to contact us at hello@sunova.ai. We're here to help and will always 
              consider legitimate concerns fairly.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
