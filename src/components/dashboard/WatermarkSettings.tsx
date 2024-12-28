import { WatermarkControls } from '@/components/WatermarkControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface WatermarkSettingsProps {
  onSettingsChange: (settings: any) => void;
}

export function WatermarkSettings({ onSettingsChange }: WatermarkSettingsProps) {
  return (
    <Card className="bg-secondary/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Advanced Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WatermarkControls onChange={onSettingsChange} />
      </CardContent>
    </Card>
  );
}