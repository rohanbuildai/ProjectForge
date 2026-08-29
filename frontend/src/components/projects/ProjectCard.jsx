import Icon from "../landing/icons";
import { getHue, getInitials, timeAgo } from "../dashboard/dashboardUtils";
import "./ProjectCard.css";

const STATUS_META = {
  active: { label: "Active", tone: "blue" },
  in_progress: { label: "In Progress", tone: "amber" },
  completed: { label: "Completed", tone: "green" },
  archived: { label: "Archived", tone: "neutral" },
};

const PRIORITY_META = {
  high: { label: "High", tone: "high" },
  medium: { label: "Medium", tone: "medium" },
  low: { label: "Low", tone: "low" },
};

function ProjectCard({
  id,
  name,
  description,
  status = "active",
  progress = 0,
  taskCount = 0,
  completedTasks = 0,
  members = [],
  priority,
  createdAt,
  updatedAt,
  layout = "grid",
}) {
  const projectName = name || "Untitled project";
  const hue = getHue(projectName);
  const statusMeta = STATUS_META[status] || STATUS_META.active;
  const priorityMeta = priority ? PRIORITY_META[priority] : null;
  const displayMembers = members.slice(0, 3);
  const extraMembers = Math.max(0, members.length - 3);
  const relativeUpdate = updatedAt ? timeAgo(updatedAt) : "";
  const relativeCreate = createdAt ? timeAgo(createdAt) : "";
  const dateLabel = relativeUpdate
    ? `Updated ${relativeUpdate}`
    : relativeCreate
      ? `Created ${relativeCreate}`
      : null;

  return (
    <article
      className={`dash-card dash-card-hover pr-card ${layout === "list" ? "is-list" : ""}`}
      data-project-id={id}
    >
      <header className="pr-top">
        <span
          className="pr-mark"
          style={{ background: `linear-gradient(135deg, ${hue}, ${hue}99)` }}
          aria-hidden="true"
        >
          {projectName[0]}
        </span>
        <h3 className="pr-name">{projectName}</h3>
        <button
          type="button"
          className="pr-menu"
          aria-label={`More actions for ${projectName}`}
        >
          <Icon name="more" size={17} />
        </button>
      </header>

      <p className="pr-desc">{description || "No description yet."}</p>

      <div className="pr-meta">
        <span className={`pr-status tone-${statusMeta.tone}`}>
          <span className="pr-status-dot" aria-hidden="true" />
          {statusMeta.label}
        </span>
        {priorityMeta && (
          <span className={`pr-priority p-${priorityMeta.tone}`}>{priorityMeta.label}</span>
        )}
      </div>

      <div className="pr-progress">
        <div className="pr-progress-meta">
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>
        <div
          className="pr-bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`${progress}% complete`}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <footer className="pr-foot">
        <span className="pr-tasks">
          <Icon name="task" size={13} />
          {taskCount} {taskCount === 1 ? "task" : "tasks"} · {completedTasks} completed
        </span>

        <span className="pr-foot-right">
          {members.length > 0 && (
            <span className="avatar-stack" aria-label={`${members.length} members`}>
              {displayMembers.map((member) => {
                const memberName = member.name || member.initials || "?";

                return (
                  <span
                    key={member.id || memberName}
                    className="avatar pr-avatar"
                    style={{ background: getHue(memberName) }}
                  >
                    {getInitials(memberName)}
                  </span>
                );
              })}
              {extraMembers > 0 && <span className="avatar-more">+{extraMembers}</span>}
            </span>
          )}
          {dateLabel && <time className="pr-updated">{dateLabel}</time>}
        </span>
      </footer>
    </article>
  );
}

export default ProjectCard;