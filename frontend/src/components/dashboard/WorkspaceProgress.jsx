import "./WorkspaceProgress.css";

const RING = [
  { label: "Completed", value: 31, tone: "green" },
  { label: "In progress", value: 9, tone: "amber" },
  { label: "Todo", value: 8, tone: "muted" },
];

function WorkspaceProgress() {
  return (
    <section className="dash-card dash-card-hover wp-card" aria-labelledby="wp-title">
      <header className="wp-head">
        <h2 className="dash-section-title" id="wp-title">
          Workspace Progress
        </h2>
        <span className="wp-chip">This week</span>
      </header>

      <div className="wp-body">
        <div className="wp-ring" role="img" aria-label="68% workspace completion">
          <svg viewBox="0 0 140 140" width="148" height="148">
            <defs>
              <linearGradient id="wp-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9b8cff" />
                <stop offset="100%" stopColor="#6a56ff" />
              </linearGradient>
            </defs>
            <circle className="wp-ring-track" cx="70" cy="70" r="60" pathLength="100" />
            <circle
              className="wp-ring-value"
              cx="70"
              cy="70"
              r="60"
              pathLength="100"
              strokeDasharray="68 32"
            />
          </svg>
          <div className="wp-ring-meta">
            <strong>68%</strong>
            <span>Workspace completion</span>
          </div>
        </div>

        <div className="wp-legend">
          <ul className="wp-list">
            {RING.map((item) => (
              <li className="wp-row" key={item.label}>
                <span className={`wp-dot is-${item.tone}`} aria-hidden="true" />
                <span className="wp-row-label">{item.label}</span>
                <strong className="wp-row-value">{item.value}</strong>
              </li>
            ))}
          </ul>

          <div className="wp-stack" aria-hidden="true">
            <span className="wp-stack-seg is-completed" style={{ flex: 31 }} />
            <span className="wp-stack-seg is-progress" style={{ flex: 9 }} />
            <span className="wp-stack-seg is-todo" style={{ flex: 8 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkspaceProgress;