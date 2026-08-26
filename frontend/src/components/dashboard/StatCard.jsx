import Icon from "../landing/icons";
import "./StatCard.css";

function StatCard({ stat }) {
  return (
    <article className="dash-card dash-card-hover stat">
      <div className="stat-top">
        <span className={`stat-icon tone-${stat.tone}`}>
          <Icon name={stat.icon} size={16} />
        </span>
        <span className="stat-note">{stat.note}</span>
      </div>
      <p className="stat-label">{stat.label}</p>
      <strong className="stat-value">{stat.value}</strong>
    </article>
  );
}

export default StatCard;