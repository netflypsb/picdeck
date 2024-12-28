import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  AlignCenter,
} from 'lucide-react';
import { WatermarkPosition, WatermarkSettings } from '@/utils/imageProcessor';

interface WatermarkControlsProps {
  onChange: (settings: WatermarkSettings) => void;
}

export function WatermarkControls({ onChange }: WatermarkControlsProps) {
  const [text, setText] = useState('Premium Watermark');
  const [position, setPosition] = useState<WatermarkPosition>('bottom-right');
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(24);

  const handleChange = (updates: Partial<WatermarkSettings>) => {
    const newSettings: WatermarkSettings = {
      text,
      position,
      opacity,
      fontSize,
      ...updates
    };
    onChange(newSettings);
  };

  return (
    <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="watermark-text">Watermark Text</Label>
        <Input
          id="watermark-text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleChange({ text: e.target.value });
          }}
          placeholder="Enter watermark text"
        />
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <div className="flex gap-2">
          <Button
            variant={position === 'top-left' ? 'default' : 'outline'}
            size="icon"
            onClick={() => {
              setPosition('top-left');
              handleChange({ position: 'top-left' });
            }}
          >
            <CornerUpLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={position === 'top-right' ? 'default' : 'outline'}
            size="icon"
            onClick={() => {
              setPosition('top-right');
              handleChange({ position: 'top-right' });
            }}
          >
            <CornerUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant={position === 'center' ? 'default' : 'outline'}
            size="icon"
            onClick={() => {
              setPosition('center');
              handleChange({ position: 'center' });
            }}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={position === 'bottom-left' ? 'default' : 'outline'}
            size="icon"
            onClick={() => {
              setPosition('bottom-left');
              handleChange({ position: 'bottom-left' });
            }}
          >
            <CornerDownLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={position === 'bottom-right' ? 'default' : 'outline'}
            size="icon"
            onClick={() => {
              setPosition('bottom-right');
              handleChange({ position: 'bottom-right' });
            }}
          >
            <CornerDownRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Opacity</Label>
        <Slider
          value={[opacity * 100]}
          onValueChange={(value) => {
            const newOpacity = value[0] / 100;
            setOpacity(newOpacity);
            handleChange({ opacity: newOpacity });
          }}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Font Size</Label>
        <Slider
          value={[fontSize]}
          onValueChange={(value) => {
            setFontSize(value[0]);
            handleChange({ fontSize: value[0] });
          }}
          min={12}
          max={72}
          step={1}
        />
      </div>
    </div>
  );
}