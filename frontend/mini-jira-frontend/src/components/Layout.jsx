import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) return children;

  const navItems = [
    { path: "/dashboard", label: "Projects", icon: "📋" },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand" onClick={() => navigate("/dashboard")}>
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="10" height="10" rx="3" fill="#6c5ce7" />
              <rect x="16" y="2" width="10" height="10" rx="3" fill="#a29bfe" opacity="0.7" />
              <rect x="2" y="16" width="10" height="10" rx="3" fill="#a29bfe" opacity="0.5" />
              <rect x="16" y="16" width="10" height="10" rx="3" fill="#6c5ce7" opacity="0.3" />
            </svg>
          </div>
          <span className="brand-name">Mini Jira</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || "User"}</span>
              <span className="user-email">{user?.email || ""}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
