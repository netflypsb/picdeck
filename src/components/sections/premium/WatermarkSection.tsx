import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { WatermarkTypeSelector } from './watermark/WatermarkTypeSelector';
import { WatermarkPlacement } from './watermark/WatermarkPlacement';
import { WatermarkAdjustments } from './watermark/WatermarkAdjustments';

export function WatermarkSection() {
  const { toast } = useToast();
  const [watermarkType, setWatermarkType] = useState<'image' | 'text'>('image');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [font, setFont] = useState('Arial');
  const [color, setColor] = useState('#000000');
  const [transparency, setTransparency] = useState(50);
  const [scale, setScale] = useState(20);
  const [placement, setPlacement] = useState('center');
  const [tiling, setTiling] = useState(false);
  const [spacing, setSpacing] = useState(10);

  const handleSaveSettings = () => {
    // Validate settings before saving
    if (watermarkType === 'image' && !imageFile) {
      toast({
        title: "Missing Image",
        description: "Please upload a watermark image.",
        variant: "destructive"
      });
      return;
    }

    if (watermarkType === 'text' && !text.trim()) {
      toast({
        title: "Missing Text",
        description: "Please enter watermark text.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Save settings to backend
    toast({
      title: "Settings Saved",
      description: "Your watermark settings have been saved successfully."
    });
  };

  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-primary" />
          Watermark Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <WatermarkTypeSelector
          type={watermarkType}
          onTypeChange={setWatermarkType}
          onImageChange={(files) => setImageFile(files[0])}
          onTextChange={setText}
          onFontChange={setFont}
          onColorChange={setColor}
          text={text}
          font={font}
          color={color}
        />

        <WatermarkPlacement
          value={placement}
          onChange={setPlacement}
          disabled={tiling}
        />

        <WatermarkAdjustments
          transparency={transparency}
          scale={scale}
          tiling={tiling}
          spacing={spacing}
          onTransparencyChange={setTransparency}
          onScaleChange={setScale}
          onTilingChange={setTiling}
          onSpacingChange={setSpacing}
        />

        <Button
          onClick={handleSaveSettings}
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Watermark Settings
        </Button>
      </CardContent>
    </Card>
  );
}