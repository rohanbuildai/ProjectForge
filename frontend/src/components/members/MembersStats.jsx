import Icon from "../landing/icons";
import "./MembersStats.css";

const CARD_META = [
  { key: "total", label: "Total members", icon: "users", tone: "violet" },
  { key: "active", label: "Active members", icon: "activity", tone: "green" },
  { key: "owners", label: "Workspace owners", icon: "shield", tone: "cyan" },
  { key: "pending", label: "Pending invites", icon: "mail", tone: "amber" },
];

function MembersStats({ stats = {} }) {
  return (
    <section className="mb-summary" aria-label="Members summary">
      {CARD_META.map((card) => {
        const value = stats[card.key] ?? 0;

        return (
          <article key={card.key} className="dash-card dash-card-hover mb-summary-card">
            <div className="mb-summary-top">
              <span className={`mb-summary-icon tone-${card.tone}`}>
                <Icon name={card.icon} size={16} />
              </span>
            </div>
            <p className="mb-summary-label">{card.label}</p>
            <strong className="mb-summary-value">{value}</strong>
          </article>
        );
      })}
    </section>
  );
}

export default MembersStats;