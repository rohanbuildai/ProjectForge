import Icon from "../landing/icons";
import "./TasksHeader.css";

function TasksHeader({ workspaceName, onCreateTask }) {
  return (
    <section className="tk-page-head" aria-labelledby="tasks-title">
      <div className="tk-page-copy">
        <p className="tk-breadcrumb">
          <span className="tk-breadcrumb-dot" aria-hidden="true" />
          {workspaceName || "Workspace"} <span aria-hidden="true">/</span> Tasks
        </p>
        <h1 className="tk-page-title" id="tasks-title">
          Tasks
        </h1>
        <p className="tk-page-sub">
          Manage, prioritize, and track work across your workspace.
        </p>
      </div>

      <button
        type="button"
        className="pf-btn pf-btn-primary tk-page-action"
        onClick={onCreateTask}
      >
        <Icon name="plus" size={15} />
        New Task
      </button>
    </section>
  );
}

export default TasksHeader;