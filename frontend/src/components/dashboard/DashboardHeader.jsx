import Icon from "../landing/icons";
import { getHue, getInitials } from "./dashboardUtils";
import "./DashboardHeader.css";

function DashboardHeader({
  onMenuClick,
  user,
  workspaceName,
  unreadCount = 0,
  pageTitle = "Dashboard",
  sectionLabel = "Overview",
}) {
  const userName = user?.name || "";
  const initials = getInitials(userName);
  const hue = getHue(userName);

  return (
    <header className="dash-header">
      <div className="dash-header-inner">
        <div className="dash-header-left">
          <button
            type="button"
            className="dash-menu-btn"
            aria-label="Open navigation"
            onClick={onMenuClick}
          >
            <Icon name="menu" size={19} />
          </button>

          <div className="dash-title">
            <h1 className="dash-page-title">{pageTitle}</h1>
            <span className="dash-breadcrumb">
              {workspaceName || "Workspace"} / {sectionLabel}
            </span>
          </div>
        </div>

        <div className="dash-header-right">
          <div className="dash-search" role="search">
            <Icon name="search" size={16} className="dash-search-icon" />
            <input
              type="search"
              className="dash-search-input"
              placeholder="Search projects, tasks…"
              aria-label="Search projects and tasks"
            />
            <kbd className="dash-search-kbd">⌘K</kbd>
          </div>

          <button type="button" className="dash-ai-chip" aria-label="Open ProjectForge Intelligence">
            <Icon name="sparkle" size={15} />
            <span className="dash-ai-chip-label">AI Insight</span>
          </button>

          <button
            type="button"
            className="dash-icon-btn"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications, none unread"
            }
          >
            <Icon name="bell" size={18} />
            {unreadCount > 0 && <span className="dash-bell-dot" aria-hidden="true" />}
          </button>

          <button type="button" className="dash-avatar-btn" aria-label="Profile menu">
            <span
              className="avatar dash-avatar"
              style={{ width: 32, height: 32, fontSize: 12, background: hue }}
            >
              {initials}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;