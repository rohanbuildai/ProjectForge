import Icon from "../landing/icons";
import { getHue, getInitials } from "../dashboard/dashboardUtils";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import "./TaskRow.css";

function TaskRow({ task }) {
  const done = task.status === "completed";
  const projectHue = getHue(task.project || "Project");
  const assigneeName = task.assignee || "—";
  const assigneeHue = getHue(assigneeName);

  return (
    <div className={`tk-row ${done ? "is-done" : ""}`}>
      <input
        type="checkbox"
        className="tk-check"
        aria-label={`Mark "${task.title}" as complete`}
        defaultChecked={done}
      />

      <div className="tk-title-wrap">
        <span className={`tk-title ${done ? "is-done" : ""}`}>{task.title}</span>
        <span className="tk-meta-sm">
          <span className="tk-meta-project-dot" style={{ background: projectHue }} aria-hidden="true" />
          {task.project}
        </span>
      </div>

      <span className="tk-project">
        <span className="tk-project-dot" style={{ background: projectHue }} aria-hidden="true" />
        {task.project}
      </span>

      <span className="tk-assignee">
        <span
          className="avatar tk-assignee-avatar"
          style={{ background: assigneeHue }}
          aria-hidden="true"
        >
          {getInitials(assigneeName)}
        </span>
        {assigneeName}
      </span>

      <TaskPriorityBadge priority={task.priority} />

      <TaskStatusBadge status={task.status} />

      <span className={`tk-due ${task.overdue ? "is-overdue" : ""} ${done ? "is-done" : ""}`}>
        {task.overdue ? <Icon name="alert" size={12} /> : null}
        {task.dueLabel}
      </span>

      <button
        type="button"
        className="tk-more"
        aria-label={`More options for "${task.title}"`}
      >
        <Icon name="more" size={17} />
      </button>
    </div>
  );
}

export default TaskRow;