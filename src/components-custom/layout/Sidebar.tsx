import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Menu,
  X,
  UserPlus,
  RotateCw,
  BarChart2,
  CreditCard,
} from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";

type SidebarItemProps = {
  icon: React.ReactNode;
  title: string;
  path: string;
  active?: boolean;
};

const SidebarItem = ({ icon, title, path, active }: SidebarItemProps) => {
  return (
    <Link to={path}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
          active ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground"
        )}
      >
        {icon}
        <span>{title}</span>
      </div>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 bg-background"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-background border-r shadow-md transition-transform duration-300 md:translate-x-0 md:static md:h-full",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-4">
          <h2 className="text-lg font-bold tracking-tight">Santana Cred IA</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 ml-auto md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm gap-1">
            <div className="px-3 py-2">
              <h2 className="mb-2 text-xs font-semibold tracking-tight">Geral</h2>
              <div className="space-y-1">
                <SidebarItem
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  title="Dashboard"
                  path="/"
                  active={location.pathname === "/"}
                />
                <SidebarItem
                  icon={<BarChart2 className="h-4 w-4" />}
                  title="Performance"
                  path="/performance"
                  active={location.pathname === "/performance"}
                />
                <SidebarItem
                  icon={<MessageSquare className="h-4 w-4" />}
                  title="Chat Inbox"
                  path="/inbox"
                  active={location.pathname === "/inbox"}
                />
                <SidebarItem
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Consultas CPF"
                  path="/cpf-consultations"
                  active={location.pathname === "/cpf-consultations"}
                />
              </div>
            </div>
            
            <div className="px-3 py-2">
              <h2 className="mb-2 text-xs font-semibold tracking-tight">Configurações</h2>
              <div className="space-y-1">
                <SidebarItem
                  icon={<UserPlus className="h-4 w-4" />}
                  title="Transbordos"
                  path="/transbordos"
                  active={location.pathname === "/transbordos"}
                />
                <SidebarItem
                  icon={<RotateCw className="h-4 w-4" />}
                  title="Retentativas"
                  path="/retries"
                  active={location.pathname === "/retries"}
                />
              </div>
            </div>
            
            <div className="px-3 py-2">
              <h2 className="mb-2 text-xs font-semibold tracking-tight">Exemplos</h2>
              <div className="space-y-1">
                <SidebarItem
                  icon={<MessageSquare className="h-4 w-4" />}
                  title="Formulários"
                  path="/form-example"
                  active={location.pathname === "/form-example"}
                />
              </div>
            </div>
        
          </nav>
        </div>
        
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full h-8 w-8 bg-primary flex items-center justify-center text-primary-foreground font-medium">
                SC
              </div>
              <div>
                <p className="text-xs font-medium">Agente IA</p>
                <p className="text-xs text-muted-foreground">v1.0.0</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
