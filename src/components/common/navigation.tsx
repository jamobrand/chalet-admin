import { HomeIcon, LayoutDashboard, CalendarCheck, UsersRound, CreditCard, ToyBrick, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const { pathname } = useLocation();

  const routes = [
    {
      href: `/admin/dashboard`,
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
      active: pathname === `/admin/dashboard`,
    },
    {
      href: `/admin/chalets`,
      icon: <HomeIcon className="h-4 w-4" />,
      label: "Chalets",
      active: pathname === `/admin/chalets`,
    },
    {
      href: `/admin/addons`,
      icon: <ToyBrick className="h-4 w-4" />,
      label: "Addons",
      active: pathname === `/admin/addons`,
    },
    {
      href: `/admin/rules`,
      icon: <ClipboardList className="h-4 w-4" />,
      label: "Rules",
      active: pathname === `/admin/rules`,
    },
    {
      href: `/admin/reservations`,
      icon: <CalendarCheck className="h-4 w-4" />,
      label: "Reservations",
      active: pathname === `/admin/reservations`,
    },
    {
      href: `/admin/customers`,
      icon: <UsersRound className="h-4 w-4" />,
      label: "Customers",
      active: pathname === `/admin/customers`,
    },
    {
      href: `/admin/transactions`,
      icon: <CreditCard className="h-4 w-4" />,
      label: "Transactions",
      active: pathname === `/admin/transactions`,
    },
    // {
    //   href: `/s/settings`,
    //   icon: <Settings className="h-4 w-4" />,
    //   label: "Settings",
    //   active: pathname === `/s/settings`,
    // },
  ];
  return (
    <nav
      className={cn("grid items-start text-sm font-medium lg:px-4", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 my-1 transition-all hover:text-[#1a3733] hover:bg-white",
            route.active ? "bg-white px-3 py-2 text-[#1a3733]" : "text-white"
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;