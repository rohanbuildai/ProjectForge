import { DEADLINES } from "./mockData";
import "./UpcomingDeadlines.css";

function UpcomingDeadlines() {
  return (
    <section className="dash-card ud-card" aria-labelledby="upcoming-title">
      <header className="dash-section-head ud-head">
        <h2 className="dash-section-title" id="upcoming-title">
          Upcoming
        </h2>
        <span className="ud-chip">Next 7 days</span>
      </header>

      <div className="ud-groups">
        {DEADLINES.map((group) => (
          <div className={`ud-group is-${group.tone}`} key={group.group}>
            <span className="ud-group-label">
              <span className="ud-group-dot" aria-hidden="true" />
              {group.group}
            </span>
            <ul className="ud-items">
              {group.items.map((item) => (
                <li className="ud-item" key={item.title}>
                  <span className="ud-title">{item.title}</span>
                  <span className="ud-meta">{item.meta}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UpcomingDeadlines;