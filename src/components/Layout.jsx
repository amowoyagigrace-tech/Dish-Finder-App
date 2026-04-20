import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Home, Search, Heart, User, ArrowLeft } from "lucide-react";

const tabs = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/search", icon: Search, label: "Search" },
  { path: "/favourites", icon: Heart, label: "Favourites" },
  { path: "/profile", icon: User, label: "Profile" },
];

// Logo icon matching the screenshot — dark square with D + fork
function LogoIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
        <line x1="7" y1="5" x2="7" y2="27" stroke="#D6C5AB" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="5" y1="5" x2="5" y2="13" stroke="#D6C5AB" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="7" y1="5" x2="7" y2="13" stroke="#D6C5AB" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="9" y1="5" x2="9" y2="13" stroke="#D6C5AB" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M5 13 Q7 17 9 13" stroke="#D6C5AB" strokeWidth="1.4" fill="none"/>
        <text x="12" y="24" fontFamily="serif" fontWeight="700" fontSize="17" fill="#D6C5AB">D</text>
      </svg>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === "/";

  const handleBack = () => {
    if (location.key && location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-5 py-3 flex items-center gap-3">
        {!isLanding && (
          <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <LogoIcon />
        <span className="text-lg font-bold text-foreground tracking-tight">DishFinder</span>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {tabs.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-all duration-200 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}