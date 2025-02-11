
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ResizeModeSelectorProps {
  value: 'fit' | 'fill';
  onChange: (value: 'fit' | 'fill') => void;
}

export function ResizeModeSelector({ value, onChange }: ResizeModeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Resize Mode</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange as (value: string) => void}
        className="grid grid-cols-2 gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fit" id="fit" />
          <Label htmlFor="fit" className="text-sm font-normal leading-snug">
            Fit
            <span className="block text-xs text-muted-foreground">
              Maintains aspect ratio, may have empty space
            </span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fill" id="fill" />
          <Label htmlFor="fill" className="text-sm font-normal leading-snug">
            Fill
            <span className="block text-xs text-muted-foreground">
              Fills entire space, may crop image
            </span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
