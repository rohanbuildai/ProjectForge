import Icon from "../landing/icons";
import "./ProjectsEmpty.css";

function ProjectsEmptyState({ variant = "empty", onCreateProject, onClearFilters }) {
  if (variant === "no-results") {
    return (
      <section className="dash-card pr-es" aria-labelledby="pr-es-title">
        <span className="pr-es-icon" aria-hidden="true">
          <Icon name="search" size={22} />
        </span>
        <h2 className="pr-es-title" id="pr-es-title">
          No projects found
        </h2>
        <p className="pr-es-text">
          No projects match your current search or filters. Try adjusting them
          to see more results.
        </p>
        <button
          type="button"
          className="pf-btn pf-btn-ghost pr-es-action"
          onClick={onClearFilters}
        >
          <Icon name="x" size={15} />
          Clear filters
        </button>
      </section>
    );
  }

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