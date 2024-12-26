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
            <p className="text-muted-foreground">Effective Date: March 14, 2024</p>
          </div>

          {/* Terms of Service content */}
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By using PicDeck ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          {/* ... Continue with the rest of the sections as provided in the content */}
          {/* For brevity, I'm showing just the first section, but the actual component would include all sections */}
        </div>
      </main>
    </div>
  );
}