import Icon from "../landing/icons";
import "./EmptyStates.css";

function EmptyTasksState({ onCreateTask }) {
  return (
    <div className="dash-card es-card">
      <span className="es-icon" aria-hidden="true">
        <Icon name="task" size={20} />
      </span>
      <h3 className="es-title">No tasks yet</h3>
      <p className="es-text">
        Break your work into tasks, assign owners, and set due dates to keep things
        moving.
      </p>
      <button
        type="button"
        className="pf-btn pf-btn-primary es-action"
        onClick={onCreateTask}
      >
        <Icon name="plus" size={15} />
        New task
      </button>
    </div>
  );
}

export default EmptyTasksState;