import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { adminRoutes } from "@/utils/adminNavigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, ListTodo, CreditCard, Users, LogOut, UserCheck } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { profile } = useUserProfile();

  const navItems = [
    { icon: FileText, label: "API Logs", href: adminRoutes.apiLogs },
    { icon: ListTodo, label: "Tasks", href: adminRoutes.tasks },
    { icon: CreditCard, label: "Transactions", href: adminRoutes.transactions },
    { icon: Users, label: "Users", href: adminRoutes.users },
    { icon: UserCheck, label: "Beta Apps", href: adminRoutes.betaApplications },
  ];

  return (
    <div className="min-h-screen flex w-full" style={{ backgroundColor: '#1c1c1f' }}>
      {/* Sidebar */}
      <aside className="w-64 border-r flex flex-col" style={{ borderColor: '#6a6a71' }}>
        <div className="p-6 border-b" style={{ borderColor: '#6a6a71' }}>
          <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: '#6a6a71' }}>
          <div className="mb-4 px-4 py-2 rounded" style={{ backgroundColor: '#2a2a2f' }}>
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="text-white font-medium truncate">{profile?.user_email}</p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
