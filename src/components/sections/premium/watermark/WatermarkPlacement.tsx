import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WatermarkPlacementProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function WatermarkPlacement({ value, onChange, disabled }: WatermarkPlacementProps) {
  return (
    <div className="space-y-2">
      <Label>Placement</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-4"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="top-left" id="top-left" />
          <Label htmlFor="top-left">Top Left</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="center" id="center" />
          <Label htmlFor="center">Center</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bottom-right" id="bottom-right" />
          <Label htmlFor="bottom-right">Bottom Right</Label>
        </div>
      </RadioGroup>
    </div>
  );
}