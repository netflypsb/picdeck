import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SupportCard() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/contact')}
        >
          Contact Support
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/faq')}
        >
          View FAQ
        </Button>
      </CardContent>
    </Card>
  );
}