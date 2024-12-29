import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';

export function WatermarkSection() {
  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-primary" />
          Watermark Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Watermark configuration coming soon...
        </p>
      </CardContent>
    </Card>
  );
}