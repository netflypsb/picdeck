import { Header } from '@/components/Header';
import { FAQSection } from '@/components/sections/FAQSection';

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4">
        <div className="py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          <FAQSection />
        </div>
      </main>
      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PicDeck. All rights reserved.</p>
      </footer>
    </div>
  );
}