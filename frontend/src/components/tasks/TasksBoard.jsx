import { getHue, getInitials } from "../dashboard/dashboardUtils";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import "./TasksBoard.css";

const COLUMNS = [
  { status: "todo", label: "To Do" },
  { status: "in_progress", label: "In Progress" },
  { status: "completed", label: "Completed" },
];

function TasksBoard({ tasks = [] }) {
  return (
    <div className="tk-board">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <section
            className="dash-card tk-col"
            key={column.status}
            aria-label={`${column.label} column`}
          >
            <header className="tk-col-head">
              <TaskStatusBadge status={column.status} />
              <span className="tk-col-count">{columnTasks.length}</span>
            </header>

            <div className="tk-col-body">
              {columnTasks.map((task) => {
                const assigneeName = task.assignee || "—";
                const assigneeHue = getHue(assigneeName);
                const projectHue = getHue(task.project || "Project");

                return (
                  <article className="tk-card" key={task.id}>
                    <h3 className="tk-card-title">{task.title}</h3>

                    <span className="tk-card-project">
                      <span
                        className="tk-project-dot"
                        style={{ background: projectHue }}
                        aria-hidden="true"
                      />
                      {task.project}
                    </span>

                    <footer className="tk-card-foot">
                      <TaskPriorityBadge priority={task.priority} tiny />
                      <span className="tk-card-right">
                        <span className={`tk-card-due ${task.overdue ? "is-overdue" : ""}`}>
                          {task.dueLabel}
                        </span>
                        <span
                          className="avatar tk-card-avatar"
                          style={{ background: assigneeHue }}
                          aria-label={`Assigned to ${assigneeName}`}
                        >
                          {getInitials(assigneeName)}
                        </span>
                      </span>
                    </footer>
                  </article>
                );
              })}

              {columnTasks.length === 0 && (
                <p className="tk-col-empty">No tasks here yet.</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default TasksBoard;