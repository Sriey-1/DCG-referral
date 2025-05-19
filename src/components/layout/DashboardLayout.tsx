
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useEffect(() => {
    // Auto-authenticate the user
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify({ name: "Demo User", email: "demo@example.com" }));
    localStorage.setItem("token", "dummy-token");
  }, []);

  return (
    <div className="app-layout">
      <AppSidebar />
      <main className="content-area overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
