import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

interface WatermarkTypeSelectorProps {
  type: 'image' | 'text';
  onTypeChange: (type: 'image' | 'text') => void;
  onImageChange: (file: File | null) => void;
  onTextChange: (text: string) => void;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
  text: string;
  font: string;
  color: string;
}

export function WatermarkTypeSelector({
  type,
  onTypeChange,
  onImageChange,
  onTextChange,
  onFontChange,
  onColorChange,
  text,
  font,
  color,
}: WatermarkTypeSelectorProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageChange(file);
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  return (
    <Tabs value={type} onValueChange={(value) => onTypeChange(value as 'image' | 'text')} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="image">Image Watermark</TabsTrigger>
        <TabsTrigger value="text">Text Watermark</TabsTrigger>
      </TabsList>

      <TabsContent value="image" className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="watermark-upload"
          />
          <label htmlFor="watermark-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Drop your watermark image here</h3>
            <p className="text-sm text-muted-foreground mt-2">
              or click to select file
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports: PNG with transparency (recommended)
            </p>
          </label>
        </div>
      </TabsContent>

      <TabsContent value="text" className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="watermark-text">Watermark Text</Label>
            <Input
              id="watermark-text"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Enter watermark text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-select">Font Family</Label>
            <Select value={font} onValueChange={onFontChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color-picker">Text Color</Label>
            <Input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="h-10 p-1"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}