import Icon from "../landing/icons";
import EmptyTasksState from "./EmptyTasksState";
import { diffDays, getHue, priorityLabel, relativeDayLabel } from "./dashboardUtils";
import "./MyTasks.css";

const PRIORITY = {
  high: "high",
  medium: "medium",
  low: "low",
};

function MyTasks({ tasks = [], tasksError = false }) {
  const openCount = tasks.filter((task) => task.status !== "completed").length;

  if (tasksError) {
    return (
      <div className="dash-card mt-error">
        <Icon name="alert" size={16} />
        Couldn't load your tasks.
      </div>
    );
  }

  return (
    <section className="dash-card mt-card" aria-labelledby="my-tasks-title">
      <div className="mt-head">
        <h2 className="dash-section-title" id="my-tasks-title">
          My Tasks
        </h2>
        <div className="mt-head-actions">
          <span className="mt-count">
            {openCount} open
          </span>
          <button type="button" className="dash-view">
            View all
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyTasksState />
      ) : (
        <div className="mt-table">
          <div className="mt-th" aria-hidden="true">
            <span />
            <span>Task</span>
            <span>Project</span>
            <span>Priority</span>
            <span>Due</span>
            <span />
          </div>

          {tasks.map((task) => {
            const done = task.status === "completed";
            const dueLabel = task.due_date
              ? relativeDayLabel(task.due_date)
              : "No date";
            const overdue = !done && (diffDays(task.due_date) ?? 0) < 0;
            const projectTitle = task.project_title || "Untitled";
            const projectHue = getHue(projectTitle);
            const priority = priorityLabel(task.priority).toUpperCase();

            return (
              <div className="mt-row" key={task.id}>
                <button
                  type="button"
                  className={`mt-check ${done ? "is-done" : ""}`}
                  aria-label={`Mark "${task.title}" as ${done ? "not " : ""}complete`}
                >
                  {done && <Icon name="check" size={12} />}
                </button>

                <div className="mt-title-wrap">
                  <span className={`mt-title ${done ? "is-done" : ""}`}>{task.title}</span>
                  <span className="mt-meta-sm">
                    <span className={`mt-dot p-${PRIORITY[task.priority] || "medium"}`} aria-hidden="true" />
                    {projectTitle} · {priorityLabel(task.priority)} · {dueLabel}
                  </span>
                </div>

                <span className="mt-project">
                  <span className="mt-project-dot" style={{ background: projectHue }} aria-hidden="true" />
                  {projectTitle}
                </span>

                <span className={`mt-prio p-${PRIORITY[task.priority] || "medium"}`}>{priority}</span>

                <span className={`mt-due ${overdue ? "is-overdue" : ""} ${done ? "is-done" : ""}`}>
                  {dueLabel}
                </span>

                <button
                  type="button"
                  className="mt-more"
                  aria-label={`More options for "${task.title}"`}
                >
                  <Icon name="more" size={17} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyTasks;