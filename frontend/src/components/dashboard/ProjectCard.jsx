import Icon from "../landing/icons";
import { MEMBERS } from "../dashboard/mockData";
import "./ProjectCard.css";

function ProjectCard({ project }) {
  return (
    <article className="dash-card dash-card-hover pc-card">
      <header className="pc-top">
        <span
          className="pc-mark"
          style={{ background: `linear-gradient(135deg, ${project.mark}, ${project.mark}99)` }}
          aria-hidden="true"
        >
          {project.name[0]}
        </span>
        <h3 className="pc-name">{project.name}</h3>
        <span className={`pc-status tone-${project.tone}`}>
          <span className="pc-status-dot" aria-hidden="true" />
          {project.status}
        </span>
      </header>

      <p className="pc-desc">{project.description}</p>

      <div className="pc-progress">
        <div className="pc-progress-meta">
          <span>Progress</span>
          <strong>{project.progress}%</strong>
        </div>
        <div className="pc-bar" role="progressbar" aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100">
          <span style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <footer className="pc-foot">
        <div className="pc-stats">
          <span className="pc-stat">
            <Icon name="task" size={13} />
            {project.tasks} {project.tasks === 1 ? "Task" : "Tasks"}
          </span>
          <span className="pc-stat">
            <Icon name="users" size={13} />
            {project.members.length + project.extra} members
          </span>
        </div>
        <div className="avatar-stack" aria-label={`${project.members.length + project.extra} members`}>
          {project.members.map((m) => (
            <span key={m} className="avatar" style={{ background: MEMBERS[m].hue }}>
              {MEMBERS[m].ini}
            </span>
          ))}
          <span className="avatar-more">+{project.extra}</span>
        </div>
      </footer>
    </article>
  );
}

export default ProjectCard;