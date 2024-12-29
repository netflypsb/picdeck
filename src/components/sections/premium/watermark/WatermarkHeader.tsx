import { CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";

export function WatermarkHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Image className="h-5 w-5 text-primary" />
        Watermark Settings
      </CardTitle>
    </CardHeader>
  );
}