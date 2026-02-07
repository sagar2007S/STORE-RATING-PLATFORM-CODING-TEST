import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  LogOut, 
  User,
  KeyRound,
  ChevronDown,
  Menu,
  X,
  Shield,
  Building2
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "from-purple-500 to-pink-500";
      case "owner":
        return "from-blue-500 to-cyan-500";
      case "user":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return { icon: Shield, label: "Admin", bg: "bg-purple-100", text: "text-purple-700" };
      case "owner":
        return { icon: Building2, label: "Owner", bg: "bg-blue-100", text: "text-blue-700" };
      case "user":
        return { icon: User, label: "User", bg: "bg-green-100", text: "text-green-700" };
      default:
        return { icon: User, label: "Guest", bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  const navLinks = {
    admin: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/stores", label: "Stores", icon: Store },
    ],
    user: [
      { to: "/user", label: "Dashboard", icon: LayoutDashboard },
    ],
    owner: [
      { to: "/owner", label: "Dashboard", icon: LayoutDashboard },
    ],
  };

  const currentLinks = user?.role ? navLinks[user.role] || [] : [];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
       
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user?.role || '')} rounded-lg flex items-center justify-center shadow-md`}>
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StoreHub
              </h1>
              {user && (
                <p className="text-xs text-gray-500">Welcome back, {user.name.split(' ')[0]}</p>
              )}
            </div>
          </div>

         
          <div className="hidden md:flex items-center gap-2">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

         
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-9 h-9 bg-gradient-to-br ${getRoleColor(user.role)} rounded-full flex items-center justify-center text-white font-semibold shadow-md`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className={`text-xs ${roleBadge.text}`}>{roleBadge.label}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

               
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-slideDown">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}>
                        <roleBadge.icon className="w-3 h-3" />
                        {roleBadge.label}
                      </div>
                    </div>

                  
                    <div className="py-1">
                      <Link
                        to="/change-password"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <KeyRound className="w-4 h-4 text-gray-500" />
                        Change Password
                      </Link>
                    </div>

                    
                    <div className="border-t border-gray-200 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

         
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

       
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slideDown">
           
            {user && (
              <div className="px-4 py-3 mb-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user.role)} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}>
                  <roleBadge.icon className="w-3 h-3" />
                  {roleBadge.label}
                </div>
              </div>
            )}

            
            <div className="space-y-1 mb-3">
              {currentLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      active
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

          
            {user ? (
              <div className="space-y-2 border-t border-gray-200 pt-3">
                <Link
                  to="/change-password"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <KeyRound className="w-5 h-5" />
                  Change Password
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold shadow-md"
              >
                <User className="w-5 h-5" />
                Login
              </Link>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;