import Icon from "../landing/icons";
import "./ProjectsSummary.css";

const CARD_META = [
  { key: "total", label: "Total Projects", icon: "folder", tone: "violet" },
  { key: "active", label: "Active", icon: "activity", tone: "cyan" },
  { key: "completed", label: "Completed", icon: "check", tone: "green" },
  { key: "archived", label: "Archived", icon: "layers", tone: "neutral" },
];

function ProjectsSummary({ summary = {} }) {
  return (
    <section className="pr-summary" aria-label="Project summary">
      {CARD_META.map((card) => {
        const value = summary[card.key] ?? 0;

        return (
          <article key={card.key} className="dash-card dash-card-hover pr-summary-card">
            <div className="pr-summary-top">
              <span className={`pr-summary-icon tone-${card.tone}`}>
                <Icon name={card.icon} size={16} />
              </span>
              <span className={`pr-summary-dot tone-${card.tone}`} aria-hidden="true" />
            </div>
            <p className="pr-summary-label">{card.label}</p>
            <strong className="pr-summary-value">{value}</strong>
          </article>
        );
      })}
    </section>
  );
}

export default ProjectsSummary;