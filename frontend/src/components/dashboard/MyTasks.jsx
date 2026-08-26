import Icon from "../landing/icons";
import { MY_TASKS } from "./mockData";
import "./MyTasks.css";

const PRIORITY = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

function MyTasks() {
  return (
    <section className="dash-card mt-card" aria-labelledby="my-tasks-title">
      <div className="mt-head">
        <h2 className="dash-section-title" id="my-tasks-title">
          My Tasks
        </h2>
        <div className="mt-head-actions">
          <span className="mt-count">5 open</span>
          <button type="button" className="dash-view">
            View all
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>

      <div className="mt-table">
        <div className="mt-th" aria-hidden="true">
          <span />
          <span>Task</span>
          <span>Project</span>
          <span>Priority</span>
          <span>Due</span>
          <span />
        </div>

        {MY_TASKS.map((task) => (
          <div className="mt-row" key={task.title}>
            <button
              type="button"
              className="mt-check"
              aria-label={`Mark "${task.title}" as complete`}
            />

            <div className="mt-title-wrap">
              <span className="mt-title">{task.title}</span>
              <span className="mt-meta-sm">
                <span className={`mt-dot p-${PRIORITY[task.priority]}`} aria-hidden="true" />
                {task.project} · {task.priority} · {task.due}
              </span>
            </div>

            <span className="mt-project">
              <span className="mt-project-dot" style={{ background: task.projectHue }} aria-hidden="true" />
              {task.project}
            </span>

            <span className={`mt-prio p-${PRIORITY[task.priority]}`}>{task.priority}</span>

            <span className={`mt-due is-${task.okay}`}>{task.due}</span>

            <button
              type="button"
              className="mt-more"
              aria-label={`More options for "${task.title}"`}
            >
              <Icon name="more" size={17} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyTasks;