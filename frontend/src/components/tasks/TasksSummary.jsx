import Icon from "../landing/icons";
import "./TasksSummary.css";

const CARD_META = [
  { key: "total", label: "Total Tasks", icon: "task", tone: "violet" },
  { key: "todo", label: "To Do", icon: "list", tone: "neutral" },
  { key: "in_progress", label: "In Progress", icon: "activity", tone: "amber" },
  { key: "completed", label: "Completed", icon: "check", tone: "green" },
  { key: "overdue", label: "Overdue", icon: "alert", tone: "red" },
];

function TasksSummary({ summary = {} }) {
  return (
    <section className="tk-summary" aria-label="Task summary">
      {CARD_META.map((card) => {
        const value = summary[card.key] ?? 0;

        return (
          <article key={card.key} className="dash-card dash-card-hover tk-summary-card">
            <div className="tk-summary-top">
              <span className={`tk-summary-icon tone-${card.tone}`}>
                <Icon name={card.icon} size={16} />
              </span>
              <span className={`tk-summary-dot tone-${card.tone}`} aria-hidden="true" />
            </div>
            <p className="tk-summary-label">{card.label}</p>
            <strong className="tk-summary-value">{value}</strong>
          </article>
        );
      })}
    </section>
  );
}

export default TasksSummary;