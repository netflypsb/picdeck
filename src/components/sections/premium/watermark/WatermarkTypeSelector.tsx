import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadZone } from "@/components/UploadZone";

interface WatermarkTypeSelectorProps {
  type: 'image' | 'text';
  onTypeChange: (type: 'image' | 'text') => void;
  onImageChange: (files: File[]) => void;
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
  return (
    <Tabs value={type} onValueChange={(value) => onTypeChange(value as 'image' | 'text')} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="image">Image Watermark</TabsTrigger>
        <TabsTrigger value="text">Text Watermark</TabsTrigger>
      </TabsList>

      <TabsContent value="image" className="space-y-4">
        <UploadZone
          onFilesSelected={onImageChange}
          maxFiles={1}
          className="h-32"
        />
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