import { Header } from "@/components/Header";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <div className="text-center mb-8">
            <h1 className="flex items-center justify-center gap-2 !mb-4">
              <FileText className="h-8 w-8 text-primary" />
              Terms of Service
            </h1>
            <p className="text-muted-foreground"><strong>Effective Date:</strong> December 26, 2024</p>
          </div>

          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By using <em>PicDeck</em> ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service.
            </p>
          </section>

          <section>
            <h2>2. Service Description</h2>
            <p>
              <em>PicDeck</em> provides an image resizing service accessible through <a href="https://picdeck.xyz" target="_blank" rel="noopener noreferrer">https://picdeck.xyz</a>. The Service is available as a free tier with limited features and as a subscription model with enhanced capabilities.
            </p>
          </section>

          <section>
            <h2>3. Subscriptions and Fees</h2>
            <ul>
              <li>The Free Tier includes limited features as outlined on our website.</li>
              <li>Paid subscriptions ("Pro" and "Premium") offer additional features and are billed monthly.</li>
              <li>All payments are securely processed through Stripe. No additional fees are charged apart from those displayed during checkout.</li>
            </ul>
          </section>

          <section>
            <h2>4. Cancellation and Refunds</h2>
            <ul>
              <li>Subscriptions can be canceled at any time through your dashboard on <em>PicDeck</em>.</li>
              <li>After cancellation, access to paid features will remain active until the end of the current billing cycle.</li>
              <li>Refunds are not issued for unused time within a subscription period.</li>
            </ul>
          </section>

          <section>
            <h2>5. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2>6. Acceptable Use</h2>
            <ul>
              <li>You agree to use the Service only for lawful purposes.</li>
              <li>You may not use the Service to upload or process content that infringes on the rights of others or violates any applicable laws.</li>
            </ul>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, <strong>Netflyp Sdn Bhd</strong> is not liable for:
            </p>
            <ul>
              <li>Indirect, incidental, or consequential damages resulting from your use of the Service.</li>
              <li>Unauthorized access to or alteration of your data.</li>
              <li>Any other damages beyond the amount you paid for the Service during the last billing period.</li>
            </ul>
          </section>

          <section>
            <h2>8. Modifications to the Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service or any part thereof at any time without notice. We are not liable for any modifications or interruptions to the Service.
            </p>
          </section>

          <section>
            <h2>9. Intellectual Property</h2>
            <p>
              All content, trademarks, and materials provided on <em>PicDeck</em> are owned by <strong>Netflyp Sdn Bhd</strong>. You may not reproduce, distribute, or create derivative works without prior written consent.
            </p>
          </section>

          <section>
            <h2>10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Malaysia. Any disputes arising from these Terms will be resolved in the courts of Malaysia.
            </p>
          </section>

          <section>
            <h2>11. Contact Information</h2>
            <p>
              If you have any questions or concerns about these Terms, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:netflypsb@gmail.com">netflypsb@gmail.com</a></li>
              <li><strong>Phone:</strong> +601154218631</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
