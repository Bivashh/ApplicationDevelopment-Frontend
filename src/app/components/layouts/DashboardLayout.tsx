import { Link, useLocation, useNavigate } from "react-router";
import { LogOut, Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface DashboardLayoutProps {
  role: 'admin' | 'staff' | 'customer';
  menuItems: { path: string; label: string; icon: React.ReactNode }[];
  children: React.ReactNode;
}

export function DashboardLayout({ role, menuItems, children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  const roleColors = {
    admin: 'bg-red-600',
    staff: 'bg-blue-600',
    customer: 'bg-green-600'
  };

  const roleNames = {
    admin: 'Admin',
    staff: 'Staff',
    customer: 'Customer'
  };

  return (
    <div className="min-h-screen flex">
      <aside className={`w-64 ${roleColors[role]} text-white flex flex-col`}>
        <div className="p-6 border-b border-white/20">
          <h1 className="text-xl font-bold">VPS System</h1>
          <p className="text-sm text-white/80 mt-1">{roleNames[role]} Portal</p>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
