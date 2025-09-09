import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCog, Eye } from 'lucide-react';

const RoleToggle = () => {
  const { role, isAdmin, toggleRole } = useUserRole();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
          {isAdmin ? <UserCog className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
          {role.toUpperCase()}
        </Badge>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleRole}
        className="text-xs w-full"
      >
        Switch to {isAdmin ? 'Viewer' : 'Admin'}
      </Button>
      <p className="text-xs text-muted-foreground mt-1 text-center">Dev Toggle</p>
    </div>
  );
};

export default RoleToggle;