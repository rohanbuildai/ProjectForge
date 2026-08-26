import Icon from "../landing/icons";
import { ACTIVITIES } from "./mockData";
import "./RecentActivity.css";

function RecentActivity() {
  return (
    <section className="dash-section" aria-labelledby="recent-activity-title">
      <div className="dash-section-head">
        <h2 className="dash-section-title" id="recent-activity-title">
          Recent Activity
        </h2>
        <button type="button" className="dash-view">
          Open activity log
          <Icon name="arrowRight" size={14} />
        </button>
      </div>

      <div className="dash-card act-card">
        <ul className="act-list">
          {ACTIVITIES.map((activity, index) => (
            <li className="act-item" key={index}>
              {activity.system ? (
                <span className="act-avatar act-avatar-system" aria-hidden="true">
                  <Icon name="settings" size={14} />
                </span>
              ) : (
                <span className="avatar act-avatar" style={{ background: activity.hue }}>
                  {activity.initials}
                </span>
              )}

              <p className="act-text">
                {activity.system ? (
                  <>
                    <strong>System</strong> {activity.verb} <strong>{activity.target}</strong>
                  </>
                ) : (
                  <>
                    <strong>{activity.actor}</strong> {activity.verb}{" "}
                    <span className="act-target">{activity.target}</span>
                  </>
                )}
              </p>

              <time className="act-time">{activity.time}</time>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default RecentActivity;