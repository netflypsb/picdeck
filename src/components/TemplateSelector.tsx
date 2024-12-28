import { useState } from 'react';
import { Check } from 'lucide-react';
import { Template } from '@/utils/templates';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplates: Template[];
  onTemplateToggle: (template: Template) => void;
}

export function TemplateSelector({
  templates,
  selectedTemplates,
  onTemplateToggle,
}: TemplateSelectorProps) {
  const platforms = Array.from(new Set(templates.map(t => t.platform)));
  const [selectedPlatform, setSelectedPlatform] = useState<string>(platforms[0]);

  const filteredTemplates = templates.filter(t => t.platform === selectedPlatform);

  return (
    <div className="space-y-4">
      <Select
        value={selectedPlatform}
        onValueChange={setSelectedPlatform}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          {platforms.map((platform) => (
            <SelectItem key={platform} value={platform}>
              {platform}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-2">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplates.some(t => 
              t.name === template.name && t.platform === template.platform
            );

            return (
              <div
                key={`${template.platform}-${template.name}`}
                onClick={() => onTemplateToggle(template)}
                className={`
                  flex items-center justify-between p-3 rounded-lg cursor-pointer
                  ${isSelected ? 'bg-primary/20 hover:bg-primary/30' : 'hover:bg-secondary'}
                `}
              >
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.width} x {template.height}
                  </p>
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}