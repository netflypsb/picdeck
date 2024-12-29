import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function UploadHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Upload className="h-5 w-5 text-primary" />
        Upload Images
      </CardTitle>
    </CardHeader>
  );
}