import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };

export function Shell({
  items,
  titles,
  switchTo,
}: {
  items: NavItem[];
  titles: Record<string, { title: string; sub: string }>;
  switchTo?: { to: string; label: string };
}) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const meta =
    titles[loc.pathname] ??
    Object.entries(titles).find(([k]) => loc.pathname.startsWith(k) && k !== "/app" && k !== "/admin")?.[1] ??
    { title: "DashStack", sub: "" };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand-mark">
          <span className="mark">D</span>
          DashStack
        </div>
        <nav className="nav">
          {items.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
              <l.icon size={17} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        {switchTo && (
          <NavLink to={switchTo.to} className="switch-link">
            {switchTo.label}
          </NavLink>
        )}
        <div className="side-user">
          <div className="avatar">{user?.avatar}</div>
          <div className="meta">
            <strong className="ellipsis">{user?.name}</strong>
            <span className="role-chip">{user?.role}</span>
          </div>
          <button
            className="icon-btn"
            style={{ marginLeft: "auto", background: "transparent", color: "#e9efe9", borderColor: "rgba(255,255,255,.15)" }}
            title="Đăng xuất"
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div>
            <h1 className="page-title">{meta.title}</h1>
            <p className="page-sub">{meta.sub}</p>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
