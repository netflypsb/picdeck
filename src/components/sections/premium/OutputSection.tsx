import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface OutputSectionProps {
  onFormatChange: (format: string) => void;
  onQualityChange: (isLossless: boolean) => void;
}

export function OutputSection({ onFormatChange, onQualityChange }: OutputSectionProps) {
  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-primary" />
          Output Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Output Format</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>PNG: Lossless quality, larger file size</p>
                  <p>JPEG: Good compression, smaller size</p>
                  <p>WebP: Modern format, best compression</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select defaultValue="png" onValueChange={onFormatChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Quality Settings</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Standard: Balanced compression for smaller files</p>
                  <p>Lossless: Maximum quality, larger file size</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <Switch onCheckedChange={onQualityChange} />
            <Label>Lossless Quality</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}