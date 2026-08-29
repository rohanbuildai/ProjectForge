import { Link, useLocation } from "react-router-dom";
import Icon from "../landing/icons";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { getHue, getInitials } from "./dashboardUtils";
import "./DashboardSidebar.css";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", icon: "dashboard", href: "/dashboard" }],
  },
  {
    label: "Work",
    items: [
      { label: "Projects", icon: "folder", href: "/projects" },
      { label: "Tasks", icon: "task", href: "/tasks" },
    ],
  },
  {
    label: "Collaborate",
    items: [
      { label: "Members", icon: "users", href: "/members" },
      { label: "Activity", icon: "activity", href: "/activity" },
    ],
  },
];

function Logo({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="pf-logo-side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9b8cff" />
          <stop offset="100%" stopColor="#6a56ff" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="8.5" height="8.5" rx="2.2" fill="url(#pf-logo-side)" />
      <rect x="13" y="2.5" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.9" />
      <rect x="2.5" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.42" />
      <rect x="13" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.66" />
    </svg>
  );
}

function DashboardSidebar({
  isOpen,
  onClose,
  onCreateWorkspace,
  user,
  workspaces,
  selectedId,
  onSelectWorkspace,
}) {
  const userName = user?.name || "";
  const initials = getInitials(userName);
  const hue = getHue(userName);
  const { pathname } = useLocation();

  const isActive = (item) =>
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <aside
      id="app-sidebar"
      className={`dash-sidebar ${isOpen ? "is-open" : ""}`}
      aria-label="Application navigation"
    >
      <a href="/dashboard" className="sb-brand">
        <span className="sb-logo">
          <Logo />
        </span>
        <span className="sb-wordmark">ProjectForge</span>
      </a>

      <WorkspaceSwitcher
        workspaces={workspaces}
        selectedId={selectedId}
        onSelectWorkspace={onSelectWorkspace}
        onCreateWorkspace={onCreateWorkspace}
      />

      <nav className="sb-nav" aria-label="Workspace navigation">
        {NAV_GROUPS.map((group) => (
          <div className="sb-group" key={group.label}>
            <span className="sb-group-label">{group.label}</span>
            <ul className="sb-group-list">
              {group.items.map((item) => {
                const active = isActive(item);

                return (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className={`sb-item ${active ? "is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                      onClick={onClose}
                    >
                      <Icon name={item.icon} size={17} strokeWidth={1.7} className="sb-item-icon" />
                      <span className="sb-item-label">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sb-spacer" />

      <div className="sb-foot">
        <button type="button" className="sb-item sb-settings" aria-label="Settings">
          <Icon name="settings" size={17} strokeWidth={1.7} className="sb-item-icon" />
          <span className="sb-item-label">Settings</span>
        </button>

        <div className="sb-user">
          <span
            className="avatar sb-user-avatar"
            style={{ width: 30, height: 30, fontSize: 11, background: hue }}
          >
            {initials}
          </span>
          <span className="sb-user-meta">
            <strong className="sb-user-name">{userName || "Guest"}</strong>
            <small className="sb-user-role">Personal account</small>
          </span>
          <Icon name="more" size={17} className="sb-user-more" />
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;