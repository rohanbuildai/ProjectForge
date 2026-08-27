import Icon from "../landing/icons";
import { getHue, getInitials } from "./dashboardUtils";
import "./ProjectCard.css";

const TONE_LABELS = {
  green: "On track",
  amber: "At risk",
  neutral: "On hold",
};

function ProjectCard({ project }) {
  const name = project.title || "Untitled";
  const hue = getHue(name);
  const progress = Number(project.progress || 0);
  const taskCount = Number(project.task_count || 0);
  const memberCount = Number(project.member_count || 0);
  const members = project.members || [];
  const statusLabel = project.status || TONE_LABELS[project.tone] || "On hold";
  const tone = project.tone || "neutral";
  const extra = Math.max(0, memberCount - members.length);

  return (
    <article className="dash-card dash-card-hover pc-card">
      <header className="pc-top">
        <span
          className="pc-mark"
          style={{ background: `linear-gradient(135deg, ${hue}, ${hue}99)` }}
          aria-hidden="true"
        >
          {name[0]}
        </span>
        <h3 className="pc-name">{name}</h3>
        <span className={`pc-status tone-${tone}`}>
          <span className="pc-status-dot" aria-hidden="true" />
          {statusLabel}
        </span>
      </header>

      <p className="pc-desc">{project.description || "No description yet."}</p>

      <div className="pc-progress">
        <div className="pc-progress-meta">
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>
        <div
          className="pc-bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <footer className="pc-foot">
        <div className="pc-stats">
          <span className="pc-stat">
            <Icon name="task" size={13} />
            {taskCount} {taskCount === 1 ? "Task" : "Tasks"}
          </span>
          <span className="pc-stat">
            <Icon name="users" size={13} />
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>
        {memberCount > 0 ? (
          <div className="avatar-stack" aria-label={`${memberCount} members`}>
            {members.slice(0, 3).map((member) => (
              <span
                key={member.id}
                className="avatar"
                style={{ background: getHue(member.name) }}
              >
                {getInitials(member.name)}
              </span>
            ))}
            {extra > 0 && <span className="avatar-more">+{extra}</span>}
          </div>
        ) : null}
      </footer>
    </article>
  );
}

export default ProjectCard;