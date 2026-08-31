import Icon from "../landing/icons";
import "./TasksEmptyState.css";

function TasksEmptyState({ variant = "empty", onCreateTask, onClearFilters }) {
  if (variant === "no-results") {
    return (
      <section className="dash-card tks-es" aria-labelledby="tks-es-title">
        <span className="tks-es-icon" aria-hidden="true">
          <Icon name="search" size={22} />
        </span>
        <h2 className="tks-es-title" id="tks-es-title">
          No tasks found
        </h2>
        <p className="tks-es-text">
          No tasks match your current search or filters. Try adjusting them to
          see more results.
        </p>
        {onClearFilters && (
          <button
            type="button"
            className="pf-btn pf-btn-ghost tks-es-action"
            onClick={onClearFilters}
          >
            <Icon name="x" size={15} />
            Clear filters
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="dash-card tks-es" aria-labelledby="tks-es-title">
      <span className="tks-es-icon" aria-hidden="true">
        <Icon name="task" size={22} />
      </span>
      <h2 className="tks-es-title" id="tks-es-title">
        No tasks yet
      </h2>
      <p className="tks-es-text">
        Create your first task to start tracking work in this workspace.
      </p>
      <button
        type="button"
        className="pf-btn pf-btn-primary tks-es-action"
        onClick={onCreateTask}
      >
        <Icon name="plus" size={15} />
        Create task
      </button>
    </section>
  );
}

export default TasksEmptyState;