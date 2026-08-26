import Icon from "../landing/icons";
import { CURRENT_USER } from "./mockData";
import "./DashboardHeader.css";

function DashboardHeader({ onMenuClick }) {
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
            <h1 className="dash-page-title">Dashboard</h1>
            <span className="dash-breadcrumb">ProjectForge / Overview</span>
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
            aria-label="Notifications, 3 unread"
          >
            <Icon name="bell" size={18} />
            <span className="dash-bell-dot" aria-hidden="true" />
          </button>

          <button type="button" className="dash-avatar-btn" aria-label="Profile menu">
            <span
              className="avatar dash-avatar"
              style={{ width: 32, height: 32, fontSize: 12, background: CURRENT_USER.hue }}
            >
              {CURRENT_USER.initials}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;