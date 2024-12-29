import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomSizeInputProps {
  useCustomSize: boolean;
  customWidth: number;
  customHeight: number;
  onCustomSizeChange: (checked: boolean) => void;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

export function CustomSizeInput({
  useCustomSize,
  customWidth,
  customHeight,
  onCustomSizeChange,
  onWidthChange,
  onHeightChange,
}: CustomSizeInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="custom-size"
          checked={useCustomSize}
          onCheckedChange={(checked) => onCustomSizeChange(checked === true)}
        />
        <Label htmlFor="custom-size">Custom Size</Label>
      </div>

      {useCustomSize && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <Input
              id="width"
              type="number"
              value={customWidth}
              onChange={(e) => onWidthChange(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <Input
              id="height"
              type="number"
              value={customHeight}
              onChange={(e) => onHeightChange(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>
      )}
    </div>
  );
}