import Icon from "../landing/icons";
import { getHue, getInitials, timeAgo } from "./dashboardUtils";
import "./RecentActivity.css";

const ACTION_LABELS = {
  created: "created",
  updated: "updated",
  completed: "completed",
  deleted: "deleted",
};

function describe(activity) {
  const actor = activity.user_name || "System";
  const verb = ACTION_LABELS[activity.action] || activity.action || "touched";
  const target = activity.metadata?.title || activity.entity_type || "an item";

  return { actor, verb, target };
}

function RecentActivity({ activity = [] }) {
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
        {activity.length === 0 ? (
          <p className="act-empty">No activity yet in this workspace.</p>
        ) : (
          <ul className="act-list">
            {activity.map((entry) => {
              const { actor, verb, target } = describe(entry);
              const actorName = entry.user_name;

              return (
                <li className="act-item" key={entry.id ?? entry.created_at}>
                  {actorName ? (
                    <span
                      className="avatar act-avatar"
                      style={{ background: getHue(actorName) }}
                    >
                      {getInitials(actorName)}
                    </span>
                  ) : (
                    <span className="act-avatar act-avatar-system" aria-hidden="true">
                      <Icon name="settings" size={14} />
                    </span>
                  )}

                  <p className="act-text">
                    <strong>{actor}</strong> {verb}{" "}
                    <span className="act-target">{target}</span>
                  </p>

                  <time className="act-time">{timeAgo(entry.created_at)}</time>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default RecentActivity;