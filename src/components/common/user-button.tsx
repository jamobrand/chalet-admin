import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Cookies from 'js-cookie';
import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserButton = () => {

  const navigate = useNavigate();
  const { toast } = useToast();
  const settingHandler = () => {
    navigate("/admin/settings");
  };

  const handleLogout = async () => {
    Cookies.remove('chalet-token');
    localStorage.removeItem('chaletInfo');
    toast({
      title: 'Logged out successfully',
      variant: 'success',
      description: 'You have been logged out of your account.',
    });
    window.location.href = '/';
  };


  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-[#1a3733]">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={settingHandler}>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;