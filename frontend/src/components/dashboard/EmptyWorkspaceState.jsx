import Icon from "../landing/icons";
import "./EmptyWorkspaceState.css";

function EmptyWorkspaceArt() {
  return (
    <div className="ews-art" aria-hidden="true">
      <span className="ews-ring ews-ring-outer" />
      <span className="ews-ring ews-ring-inner" />
      <span className="ews-logo">
        <svg viewBox="0 0 24 24" width="40" height="40">
          <defs>
            <linearGradient id="pf-logo-ews" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9b8cff" />
              <stop offset="100%" stopColor="#6a56ff" />
            </linearGradient>
          </defs>
          <rect x="2.5" y="2.5" width="8.5" height="8.5" rx="2.2" fill="url(#pf-logo-ews)" />
          <rect x="13" y="2.5" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.9" />
          <rect x="2.5" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.42" />
          <rect x="13" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.66" />
        </svg>
      </span>
    </div>
  );
}

function EmptyWorkspaceState({ onCreateWorkspace }) {
  return (
    <section className="dash-section ews" aria-labelledby="ews-title">
      <div className="dash-card ews-card">
        <EmptyWorkspaceArt />

        <h2 className="ews-title" id="ews-title">
          Welcome to ProjectForge
        </h2>
        <p className="ews-text">
          You don't have a workspace yet. Create your first workspace to start managing
          projects, tasks, and your team.
        </p>

        <button
          type="button"
          className="pf-btn pf-btn-primary ews-action"
          onClick={onCreateWorkspace}
        >
          <Icon name="plus" size={15} />
          Create workspace
        </button>

        <p className="ews-tip">
          <Icon name="shield" size={13} />
          Workspaces are protected with role-based access
        </p>
      </div>
    </section>
  );
}

export default EmptyWorkspaceState;