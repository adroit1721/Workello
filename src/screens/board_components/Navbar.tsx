import "./navbar.css";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar-root">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          <span className="navbar-logo-icon">W</span>
          <span className="navbar-logo-text">Workello</span>
        </a>

        {/* Workspace label (center) */}
        <div className="navbar-workspace-badge">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          My Workspace
        </div>

        {/* Right side */}
        <div className="navbar-right">
          {isAuthenticated && user ? (
            <div className="navbar-profile-wrapper">
              {/* Profile button */}
              <button
                id="profile-menu-btn"
                className="navbar-avatar-btn"
                onClick={() => setShowProfileMenu((v) => !v)}
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
              >
                <span className="navbar-avatar">{initials}</span>
                <span className="navbar-avatar-name">{user.name}</span>
                <svg
                  className={`navbar-chevron ${showProfileMenu ? "rotate" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <div id="profile-dropdown" className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <div className="navbar-dropdown-avatar">{initials}</div>
                    <div>
                      <p className="navbar-dropdown-name">{user.name}</p>
                      <p className="navbar-dropdown-email">User ID: {user.userId}</p>
                    </div>
                  </div>
                  <div className="navbar-dropdown-divider" />
                  
                  {user.role === "admin" && (
                    <a
                      href="/admin"
                      className="navbar-dropdown-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                      Admin Dashboard
                    </a>
                  )}

                  <button
                    id="logout-btn"
                    className="navbar-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="login-btn"
              className="navbar-login-btn"
              onClick={() => navigate("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Go to Login
            </button>
          )}
        </div>
      </nav>

      {/* Click-outside to close dropdown */}
      {showProfileMenu && (
        <div
          className="dropdown-backdrop"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </>
  );
}
