import { ArrowUpToLine, ZapIcon } from 'lucide-react';

const steps = [
  {
    icon: ArrowUpToLine,
    title: "Upload Your Images",
    description: "Drag and drop your pictures or click to select files"
  },
  {
    icon: ZapIcon,
    title: "Process and Download",
    description: "Click the button to get your resized images in a zip file"
  }
];

export function UserGuideSection() {
  return (
    <section className="py-12 space-y-8">
      <h2 className="text-3xl font-bold text-center">How It Works</h2>
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8 px-4">
        {steps.map((step, index) => (
          <div 
            key={step.title}
            className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-secondary/30 backdrop-blur-sm"
          >
            <step.icon className="w-12 h-12 text-primary" />
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-muted-foreground text-center">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}