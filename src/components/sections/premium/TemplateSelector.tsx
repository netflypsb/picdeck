import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SOCIAL_TEMPLATES, Template } from "@/utils/imageProcessor";

interface TemplateSelectorProps {
  selectedTemplates: Template[];
  onTemplateToggle: (template: Template) => void;
}

export function TemplateSelector({ selectedTemplates, onTemplateToggle }: TemplateSelectorProps) {
  const isAllSelected = selectedTemplates.length === Object.values(SOCIAL_TEMPLATES).length - 1; // -1 for ALL template

  const handleTemplateToggle = (template: Template) => {
    if (template.name === 'All Templates') {
      if (!isAllSelected) {
        // Select all templates except the "All Templates" option
        const allTemplates = Object.values(SOCIAL_TEMPLATES).filter(t => t.name !== 'All Templates');
        allTemplates.forEach(t => {
          if (!selectedTemplates.some(st => st.name === t.name)) {
            onTemplateToggle(t);
          }
        });
      } else {
        // Deselect all templates
        selectedTemplates.forEach(t => onTemplateToggle(t));
      }
    } else {
      onTemplateToggle(template);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Templates</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
        {Object.values(SOCIAL_TEMPLATES).map((template) => (
          <div key={template.name} className="flex items-center space-x-2">
            <Checkbox
              id={template.name}
              checked={template.name === 'All Templates' ? isAllSelected : selectedTemplates.some(t => t.name === template.name)}
              onCheckedChange={() => handleTemplateToggle(template)}
            />
            <label
              htmlFor={template.name}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {template.name}
              {template.name !== 'All Templates' && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({template.width}x{template.height})
                </span>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}