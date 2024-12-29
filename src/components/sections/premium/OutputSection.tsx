import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from 'lucide-react';

export function OutputSection() {
  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-primary" />
          Output Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Output settings configuration coming soon...
        </p>
      </CardContent>
    </Card>
  );
}