import "./ProjectsSkeleton.css";

function ProjectsSkeleton() {
  return (
    <div className="pr-sk-page" role="status" aria-busy="true" aria-label="Loading projects">
      <span className="visually-hidden">Loading projects…</span>

      <div className="pr-sk-head" aria-hidden="true">
        <div className="pr-sk pr-sk-line pr-sk-w-24" />
        <div className="pr-sk pr-sk-title" />
        <div className="pr-sk pr-sk-line pr-sk-w-48" />
      </div>

      <div className="pr-sk-stats" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="pr-sk pr-sk-stat" key={index} />
        ))}
      </div>

      <div className="pr-sk pr-sk-toolbar" aria-hidden="true" />

      <div className="pr-sk-col" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="pr-sk pr-sk-card" key={index} />
        ))}
      </div>
    </div>
  );
}

export default ProjectsSkeleton;