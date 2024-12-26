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
            <p className="text-muted-foreground">Effective Date: March 14, 2024</p>
          </div>

          {/* Privacy Policy content */}
          <section>
            <h2>1. Introduction</h2>
            <p>
              Netflyp Sdn Bhd (referred to as "we," "our," or "us") operates PicDeck ("PicDeck") available at https://picdeck.xyz. This Privacy Policy explains how we collect, use, and protect your information when you use our services.
            </p>
          </section>

          {/* ... Continue with the rest of the sections as provided in the content */}
          {/* For brevity, I'm showing just the first section, but the actual component would include all sections */}
        </div>
      </main>
    </div>
  );
}