import { ListOrdered, Menu, RailSymbol, Settings, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import UserButton from "./user-button";

const Header = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      href: `/s/dashboard`,
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
      active: pathname === `/s/dashboard`,
    },
    {
      href: `/s/staffs`,
      icon: <UsersRound className="h-4 w-4" />,
      label: "Staff",
      active: pathname === `/s/staffs`,
    },
    {
      href: `/s/section-blocks`,
      icon: <RailSymbol className="h-4 w-4" />,
      label: "Section Blocks",
      active: pathname === `/s/section-blocks`,
    },
    {
      href: `/s/inspection-schedules`,
      icon: <ListOrdered className="h-4 w-4" />,
      label: "Inspector Schedules",
      active: pathname === `/s/inspector-schedules`,
    },
    {
      href: `/s/settings`,
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
      active: pathname === `/s/settings`,
    },
  ];

  const onClick = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 md:left-[240px] right-0 z-20 flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-normal shrink-0 md:hidden bg-[#27534c]/30 hover:bg-[#27534c] hover:text-[#27534c] border-none 
                    focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-[#1a3733] transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#27534c]">
          <div className="mt-8">
            <nav
              className={cn("grid items-start font-medium lg:px-4", className)}
              {...props}
            >
              {routes.map((route) => (
                <span
                  key={route.href}
                  onClick={() => onClick(route.href)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 my-1 transition-all hover:text-[#1a3733] hover:bg-white",
                    route.active
                      ? "bg-white px-3 py-2 text-[#27534c]"
                      : "text-white"
                  )}
                >
                  {route.icon}
                  {route.label}
                </span>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1"></div>
      <UserButton />
    </header>
  );
};

export default Header;