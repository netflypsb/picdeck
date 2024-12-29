import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { WatermarkTypeSelector } from './watermark/WatermarkTypeSelector';
import { WatermarkPlacement } from './watermark/WatermarkPlacement';
import { WatermarkAdjustments } from './watermark/WatermarkAdjustments';
import { ImagePreview } from '@/components/ImagePreview';

interface WatermarkSectionRef {
  applyWatermark: (file: File) => Promise<Blob>;
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

  const applyWatermark = useCallback(async (originalImage: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const applyWatermarkToCanvas = () => {
          ctx.globalAlpha = transparency / 100;

          if (watermarkType === 'image' && imageFile) {
            const watermarkImg = document.createElement('img');
            watermarkImg.onload = () => {
              const scaledWidth = img.width * (scale / 100);
              const scaledHeight = (watermarkImg.height / watermarkImg.width) * scaledWidth;

              let x = 0, y = 0;
              if (!tiling) {
                switch (placement) {
                  case 'top-left':
                    x = 10;
                    y = 10;
                    break;
                  case 'center':
                    x = (canvas.width - scaledWidth) / 2;
                    y = (canvas.height - scaledHeight) / 2;
                    break;
                  case 'bottom-right':
                    x = canvas.width - scaledWidth - 10;
                    y = canvas.height - scaledHeight - 10;
                    break;
                }
                ctx.drawImage(watermarkImg, x, y, scaledWidth, scaledHeight);
              } else {
                for (let i = 0; i < canvas.width; i += scaledWidth + spacing) {
                  for (let j = 0; j < canvas.height; j += scaledHeight + spacing) {
                    ctx.drawImage(watermarkImg, i, j, scaledWidth, scaledHeight);
                  }
                }
              }
              canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to create image blob'));
              }, 'image/png');
            };
            watermarkImg.src = URL.createObjectURL(imageFile);
          } else if (watermarkType === 'text' && text) {
            ctx.font = `${Math.floor(img.width * (scale / 100))}px ${font}`;
            ctx.fillStyle = color;
            
            const metrics = ctx.measureText(text);
            const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

            if (!tiling) {
              let x = 0, y = 0;
              switch (placement) {
                case 'top-left':
                  x = 10;
                  y = textHeight + 10;
                  break;
                case 'center':
                  x = (canvas.width - metrics.width) / 2;
                  y = (canvas.height + textHeight) / 2;
                  break;
                case 'bottom-right':
                  x = canvas.width - metrics.width - 10;
                  y = canvas.height - 10;
                  break;
              }
              ctx.fillText(text, x, y);
            } else {
              for (let i = 0; i < canvas.width; i += metrics.width + spacing) {
                for (let j = textHeight; j < canvas.height; j += textHeight + spacing) {
                  ctx.fillText(text, i, j);
                }
              }
            }
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create image blob'));
            }, 'image/png');
          } else {
            // If no watermark is set, return the original image
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create image blob'));
            }, 'image/png');
          }
        };

        applyWatermarkToCanvas();
      };

      img.src = URL.createObjectURL(originalImage);
    });
  }, [watermarkType, imageFile, text, font, color, transparency, scale, placement, tiling, spacing]);

  useImperativeHandle(ref, () => ({
    applyWatermark
  }));

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
          onImageChange={handleImageChange}
          onTextChange={setText}
          onFontChange={setFont}
          onColorChange={setColor}
          text={text}
          font={font}
          color={color}
        />

        {watermarkType === 'image' && imageFile && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Watermark Preview</h4>
            <div className="w-32">
              <ImagePreview
                file={imageFile}
                onRemove={() => setImageFile(null)}
              />
            </div>
          </div>
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