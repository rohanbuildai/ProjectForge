import { TASK_ACTIVITY } from "./mockData";
import "./TaskActivity.css";

function TaskActivity() {
  const peak = 70; // mock chart ceiling, keeps bars balanced
  const total = "46";

  return (
    <section className="dash-card dash-card-hover ta-card" aria-labelledby="ta-title">
      <header className="ta-head">
        <h2 className="dash-section-title" id="ta-title">
          Task Activity
        </h2>
        <span className="ta-chip">{total} tasks · This week</span>
      </header>

      <div className="ta-grid" role="img" aria-label="Task activity per day this week">
        {TASK_ACTIVITY.map((d) => (
          <div className="ta-col" key={d.day}>
            <div className="ta-track">
              <span
                className={`ta-bar ${d.today ? "is-today" : ""}`}
                style={{ height: `${Math.max(8, (d.value / peak) * 100)}%` }}
              >
                <span className="ta-tip">{d.value}</span>
              </span>
            </div>
            <span className={`ta-day ${d.today ? "is-today" : ""}`}>{d.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TaskActivity;