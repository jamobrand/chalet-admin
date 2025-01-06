import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chalet } from './types/types';

interface ChaletActionsProps {
  chalet: Chalet;
}

export const ChaletActions = ({ chalet }: ChaletActionsProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`/admin/chalets/edit-chalet/${chalet.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Edit Chalet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
