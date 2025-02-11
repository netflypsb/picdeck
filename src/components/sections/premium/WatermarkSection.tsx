
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export interface WatermarkSettings {
  type: 'text' | 'image';
  text?: string;
  fontSize?: number;
  opacity: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export function WatermarkSection() {
  const [settings, setSettings] = useState<WatermarkSettings>({
    type: 'text',
    text: '',
    fontSize: 24,
    opacity: 0.5,
    position: 'bottom-right'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watermark Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Watermark Type</Label>
            <Select 
              value={settings.type}
              onValueChange={(value: 'text' | 'image') => 
                setSettings(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.type === 'text' && (
            <div className="space-y-2">
              <Label>Watermark Text</Label>
              <Input
                value={settings.text}
                onChange={(e) => setSettings(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter your watermark text"
              />
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Slider
                  value={[settings.fontSize || 24]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, fontSize: value[0] }))}
                  min={12}
                  max={72}
                  step={1}
                />
                <div className="text-sm text-muted-foreground">{settings.fontSize}px</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Opacity</Label>
            <Slider
              value={[settings.opacity * 100]}
              onValueChange={(value) => setSettings(prev => ({ ...prev, opacity: value[0] / 100 }))}
              min={10}
              max={100}
              step={1}
            />
            <div className="text-sm text-muted-foreground">{Math.round(settings.opacity * 100)}%</div>
          </div>

          <div>
            <Label>Position</Label>
            <Select 
              value={settings.position}
              onValueChange={(value: WatermarkSettings['position']) => 
                setSettings(prev => ({ ...prev, position: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="center">Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
