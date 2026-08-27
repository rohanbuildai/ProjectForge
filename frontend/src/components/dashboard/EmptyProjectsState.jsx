import Icon from "../landing/icons";
import "./EmptyStates.css";

function EmptyProjectsState({ onCreateProject }) {
  return (
    <div className="dash-card es-card">
      <span className="es-icon" aria-hidden="true">
        <Icon name="folder" size={20} />
      </span>
      <h3 className="es-title">No projects yet</h3>
      <p className="es-text">
        Create your first project to plan work, track progress, and keep your team
        aligned.
      </p>
      <button
        type="button"
        className="pf-btn pf-btn-primary es-action"
        onClick={onCreateProject}
      >
        <Icon name="plus" size={15} />
        New project
      </button>
    </div>
  );
}

export default EmptyProjectsState;