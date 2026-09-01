import "./MembersSkeleton.css";

function MembersSkeleton() {
  return (
    <div className="mbsk-page" role="status" aria-busy="true" aria-label="Loading members">
      <span className="visually-hidden">Loading members…</span>

      <div className="mbsk-summary" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="mbsk mbsk-stat" key={index} />
        ))}
      </div>

      <div className="mbsk mbsk-toolbar" aria-hidden="true" />

      <div className="dash-card mbsk-table" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="mbsk-row" key={index}>
            <div className="mbsk-avatar" />
            <div className="mbsk mbsk-line mbsk-w-lg" />
            <div className="mbsk mbsk-line mbsk-w-sm" />
            <div className="mbsk mbsk-line mbsk-w-xs" />
            <div className="mbsk mbsk-line mbsk-w-sm" />
            <div className="mbsk mbsk-line mbsk-w-xs" />
            <div className="mbsk mbsk-more" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersSkeleton;