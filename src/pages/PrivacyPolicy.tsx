import { Header } from "@/components/Header";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <div className="text-center mb-8">
            <h1 className="flex items-center justify-center gap-2 !mb-4">
              <Shield className="h-8 w-8 text-primary" />
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Effective Date: December 26, 2024</p>
          </div>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to PicDeck! This Privacy Policy outlines how Netflyp Sdn Bhd ("we," "our," or "us"), the operator of PicDeck available at <a href="https://picdeck.xyz" target="_blank" rel="noopener noreferrer">https://picdeck.xyz</a>, collects, uses, and safeguards your personal information. By using PicDeck, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p><strong>Account Information:</strong> We collect your email address and password when you create an account. This information is essential for account management and access to our services.</p>
            <p><strong>Payment Information:</strong> All payments are processed securely through Stripe. We do not store your credit card or payment details. Stripe’s privacy policy governs how your payment information is handled.</p>
            <p><strong>Usage Data:</strong> We collect information such as your IP address, browser type, device type, and interaction with the PicDeck platform. This data is used to improve functionality, enhance security, and provide a better user experience.</p>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>Your information is used for the following purposes:</p>
            <ul>
              <li>To provide, operate, and maintain PicDeck services.</li>
              <li>To process your subscription payments securely through Stripe.</li>
              <li>To communicate updates, improvements, and support notifications.</li>
              <li>To analyze usage trends and enhance the platform’s performance and security.</li>
              <li>To comply with legal obligations and resolve disputes.</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Storage and Security</h2>
            <p>
              Your data is securely stored using Supabase’s cloud infrastructure, which implements industry-standard encryption and access control mechanisms. While we strive to protect your data, no method of storage or transmission is entirely secure. We encourage you to use strong passwords and protect your account credentials.
            </p>
          </section>

          <section>
            <h2>5. Sharing of Information</h2>
            <p>
              We do not sell, rent, or share your personal information with third parties, except in the following cases:
            </p>
            <ul>
              <li><strong>Payment Processing:</strong> Your payment data is shared with Stripe for secure transaction handling.</li>
              <li><strong>Legal Compliance:</strong> We may disclose information if required by law or to protect our legal rights.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or sale, your information may be transferred as part of the transaction.</li>
            </ul>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time through your account dashboard. If you wish to exercise additional rights, such as data portability or withdrawal of consent, please contact us at <a href="mailto:netflypsb@gmail.com">netflypsb@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2>7. Cookies and Tracking</h2>
            <p>
              PicDeck may use cookies and similar tracking technologies to enhance your user experience. These cookies help us understand usage patterns, store preferences, and provide personalized content. You can control or disable cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal compliance. Updated policies will be posted on this page with the revised "Effective Date." We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2>9. Contact Information</h2>
            <p>
              If you have questions, concerns, or feedback about this Privacy Policy, please contact us:
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
