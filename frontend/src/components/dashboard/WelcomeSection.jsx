import Icon from "../landing/icons";
import { formatLongDate } from "./dashboardUtils";
import "./WelcomeSection.css";
import "../projects/CreateProjectModal";

function WelcomeSection({ user, workspace }) {
  const todayLabel = formatLongDate(new Date());

  return (
    <section className="dash-section welcome" aria-label="Welcome">
      <div className="welcome-copy">
        <p className="welcome-eyebrow">
          <span className="welcome-ws-dot" aria-hidden="true" />
          Working in <strong>{workspace?.name || "…"}</strong>
          <span className="welcome-eyebrow-sep" aria-hidden="true">
            ·
          </span>
          {todayLabel}
        </p>
        <h2 className="welcome-title">
          Good morning, {user?.name || "there"}
          <span className="welcome-wave" aria-hidden="true">
            &#128075;
          </span>
        </h2>
        <p className="welcome-sub">Here's what's happening across your workspace today.</p>
      </div>

      <div className="welcome-actions">
        <button type="button" className="pf-btn pf-btn-ghost welcome-btn">
          <Icon name="users" size={15} className="welcome-btn-icon" />
          Invite member
        </button>
        <button type="button" className="pf-btn pf-btn-ghost welcome-btn">
          <Icon name="plus" size={15} className="welcome-btn-icon" />
          New task
        </button>
        <button type="button" className="pf-btn pf-btn-primary welcome-btn">
          <Icon name="plus" size={15} className="welcome-btn-icon" />
          New project
        </button>
      </div>
    </section>
  );
}

export default WelcomeSection;