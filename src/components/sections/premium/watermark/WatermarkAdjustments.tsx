import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface WatermarkAdjustmentsProps {
  transparency: number;
  scale: number;
  tiling: boolean;
  spacing: number;
  onTransparencyChange: (value: number) => void;
  onScaleChange: (value: number) => void;
  onTilingChange: (checked: boolean) => void;
  onSpacingChange: (value: number) => void;
}

export function WatermarkAdjustments({
  transparency,
  scale,
  tiling,
  spacing,
  onTransparencyChange,
  onScaleChange,
  onTilingChange,
  onSpacingChange,
}: WatermarkAdjustmentsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Transparency</Label>
          <span className="text-sm text-muted-foreground">{transparency}%</span>
        </div>
        <Slider
          value={[transparency]}
          onValueChange={([value]) => onTransparencyChange(value)}
          min={10}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Scale</Label>
          <span className="text-sm text-muted-foreground">{scale}%</span>
        </div>
        <Slider
          value={[scale]}
          onValueChange={([value]) => onScaleChange(value)}
          min={10}
          max={50}
          step={1}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tiling"
            checked={tiling}
            onCheckedChange={onTilingChange}
          />
          <Label htmlFor="tiling">Enable Tiling</Label>
        </div>

        {tiling && (
          <div className="space-y-2">
            <Label htmlFor="spacing">Spacing (px)</Label>
            <Input
              id="spacing"
              type="number"
              min={0}
              value={spacing}
              onChange={(e) => onSpacingChange(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}