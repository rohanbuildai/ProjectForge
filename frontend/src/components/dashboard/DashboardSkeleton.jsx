import "./DashboardSkeleton.css";

function DashboardSkeleton() {
  return (
    <div className="sk-page" role="status" aria-busy="true" aria-label="Loading dashboard">
      <span className="visually-hidden">Loading dashboard…</span>

      <div className="sk-welcome">
        <div className="sk sk-line w-24" />
        <div className="sk sk-line w-64 sk-line-lg" />
        <div className="sk sk-line w-48" />
      </div>

      <div className="sk sk-hero" />

      <div className="sk-stats">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="sk sk-stat" key={index} />
        ))}
      </div>

      <div className="sk-col">
        <div className="sk sk-panel sk-panel-lg" />
        <div className="sk sk-panel" />
      </div>

      <div className="sk-projects">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="sk sk-panel" key={index} />
        ))}
      </div>

      <div className="sk-col">
        <div className="sk sk-panel sk-panel-lg" />
        <div className="sk sk-panel sk-panel-lg" />
      </div>
    </div>
  );
}

export default DashboardSkeleton;