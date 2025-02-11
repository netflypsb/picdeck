import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { WatermarkTypeSelector } from './watermark/WatermarkTypeSelector';
import { WatermarkPlacement } from './watermark/WatermarkPlacement';
import { WatermarkAdjustments } from './watermark/WatermarkAdjustments';
import { WatermarkHeader } from './watermark/WatermarkHeader';
import { WatermarkImagePreview } from './watermark/WatermarkImagePreview';

interface WatermarkSectionRef {
  getWatermarkSettings: () => any;
}

export const WatermarkSection = forwardRef<WatermarkSectionRef>((_, ref) => {
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

  const handleImageChange = useCallback((file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive"
        });
        return;
      }
      setImageFile(file);
      toast({
        title: "Watermark image uploaded",
        description: "Your watermark image has been set successfully."
      });
    }
  }, [toast]);

  const getWatermarkSettings = useCallback(() => {
    if (watermarkType === 'image' && !imageFile) return null;
    if (watermarkType === 'text' && !text) return null;

    const settings = {
      type: watermarkType,
      imageFile: watermarkType === 'image' ? imageFile : undefined,
      text: watermarkType === 'text' ? text : undefined,
      font,
      color,
      transparency,
      scale,
      placement,
      tiling,
      spacing
    };

    console.log('Returning watermark settings:', settings);
    return settings;
  }, [watermarkType, imageFile, text, font, color, transparency, scale, placement, tiling, spacing]);

  useImperativeHandle(ref, () => ({
    getWatermarkSettings
  }));

  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <WatermarkHeader />
      <CardContent className="space-y-6">
        <WatermarkTypeSelector
          type={watermarkType}
          onTypeChange={setWatermarkType}
          onImageChange={handleImageChange}
          onTextChange={setText}
          onFontChange={setFont}
          onColorChange={setColor}
          text={text}
          font={font}
          color={color}
        />

        {watermarkType === 'image' && imageFile && (
          <WatermarkImagePreview
            imageFile={imageFile}
            onRemove={() => setImageFile(null)}
          />
        )}

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
      </CardContent>
    </Card>
  );
});

WatermarkSection.displayName = 'WatermarkSection';