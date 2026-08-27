import "./TaskActivity.css";

function TaskActivity({ activity = [] }) {
  const total = activity.reduce((sum, day) => sum + Number(day.count || 0), 0);
  const peak = Math.max(1, ...activity.map((day) => Number(day.count || 0)));
  const hasData = activity.length > 0 && total > 0;

  return (
    <section className="dash-card dash-card-hover ta-card" aria-labelledby="ta-title">
      <header className="ta-head">
        <h2 className="dash-section-title" id="ta-title">
          Task Activity
        </h2>
        <span className="ta-chip">
          {total} task{total === 1 ? "" : "s"} · This week
        </span>
      </header>

      {hasData ? (
        <div className="ta-grid" role="img" aria-label="Tasks created per day this week">
          {activity.map((day) => (
            <div className="ta-col" key={day.date}>
              <div className="ta-track">
                <span
                  className={`ta-bar ${day.isToday ? "is-today" : ""}`}
                  style={{ height: `${Math.max(8, (Number(day.count) / peak) * 100)}%` }}
                >
                  <span className="ta-tip">{day.count}</span>
                </span>
              </div>
              <span className={`ta-day ${day.isToday ? "is-today" : ""}`}>{day.day}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="ta-empty">
          <p>No tasks created this week.</p>
        </div>
      )}
    </section>
  );
}

export default TaskActivity;