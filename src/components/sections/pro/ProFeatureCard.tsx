import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ProFeatureCard({ icon: Icon, title, description }: ProFeatureCardProps) {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}