import "./TasksSkeleton.css";

function TasksSkeleton() {
  return (
    <div className="tks-sk-page" role="status" aria-busy="true" aria-label="Loading tasks">
      <span className="visually-hidden">Loading tasks…</span>

      <div className="tks-sk-summary" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="tks-sk tks-sk-stat" key={index} />
        ))}
      </div>

      <div className="tks-sk tks-sk-toolbar" aria-hidden="true" />

      <div className="dash-card tks-sk-table" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="tks-sk-row" key={index}>
            <div className="tks-sk tks-sk-check" />
            <div className="tks-sk tks-sk-line" />
            <div className="tks-sk tks-sk-line tks-sk-w-sm" />
            <div className="tks-sk tks-sk-line tks-sk-w-xs" />
            <div className="tks-sk tks-sk-line tks-sk-w-xs" />
            <div className="tks-sk tks-sk-line tks-sk-w-xs" />
            <div className="tks-sk tks-sk-line tks-sk-w-xs" />
            <div className="tks-sk tks-sk-check" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TasksSkeleton;