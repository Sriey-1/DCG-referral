
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FolderCheck, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    window.location.href = "/login";
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/referrals", label: "Referrals", icon: <FolderCheck size={20} /> },
    { path: "/deals", label: "Deals", icon: <Briefcase size={20} /> },
    { path: "/reports", label: "Reports", icon: <FileText size={20} /> },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar h-screen flex flex-col transition-all duration-300 border-r border-sidebar-border relative",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center p-4 border-b border-sidebar-border">
        <FolderCheck className="text-dubai-gold h-6 w-6" />
        {!collapsed && (
          <span className="ml-2 font-semibold text-sidebar-foreground text-lg whitespace-nowrap">
            DCG Referrals
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-dubai-gold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  collapsed && "justify-center"
                )
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-2 border-t border-sidebar-border">
        <div className={cn("flex items-center mb-2 px-3 py-2", collapsed ? "justify-center" : "")}>
          <User size={20} className="text-sidebar-foreground" />
          {!collapsed && (
            <span className="ml-3 text-sidebar-foreground text-sm">
              {localStorage.getItem("user") 
                ? JSON.parse(localStorage.getItem("user") as string).name 
                : "User"}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent/50 w-full flex items-center",
            collapsed ? "justify-center" : ""
          )}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 rounded-full bg-sidebar border border-sidebar-border h-8 w-8"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
        )}
      </Button>
    </aside>
  );
}
