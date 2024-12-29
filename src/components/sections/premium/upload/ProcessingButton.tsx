import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ProcessingButtonProps {
  isProcessing: boolean;
  canProcess: boolean;
  onClick: () => void;
}

export function ProcessingButton({ isProcessing, canProcess, onClick }: ProcessingButtonProps) {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onClick}
        disabled={isProcessing || !canProcess}
        className="w-full md:w-auto"
      >
        <Download className="mr-2 h-4 w-4" />
        {isProcessing ? 'Processing...' : 'Process & Download'}
      </Button>
    </div>
  );
}