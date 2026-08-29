import Icon from "../landing/icons";
import "./ProjectsEmpty.css";

function ProjectsEmptyState({ onCreateProject }) {
  return (
    <section className="dash-card pr-es" aria-labelledby="pr-es-title">
      <span className="pr-es-icon" aria-hidden="true">
        <Icon name="folder" size={22} />
      </span>
      <h2 className="pr-es-title" id="pr-es-title">
        No projects yet
      </h2>
      <p className="pr-es-text">
        Get started by creating your first project to plan work, track progress,
        and keep your team aligned.
      </p>
      <button
        type="button"
        className="pf-btn pf-btn-primary pr-es-action"
        onClick={onCreateProject}
      >
        <Icon name="plus" size={15} />
        Create your first project
      </button>
    </section>
  );
}

export default ProjectsEmptyState;