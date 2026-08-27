import Icon from "../landing/icons";
import "./DashboardErrorState.css";

function DashboardErrorState({ onRetry }) {
  return (
    <section className="dash-section derr" aria-labelledby="derr-title" role="alert">
      <div className="dash-card derr-card">
        <span className="derr-icon" aria-hidden="true">
          <Icon name="alert" size={22} />
        </span>
        <h2 className="derr-title" id="derr-title">
          Something went wrong
        </h2>
        <p className="derr-text">We couldn't load your workspace data.</p>
        <button
          type="button"
          className="pf-btn pf-btn-ghost derr-action"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    </section>
  );
}

export default DashboardErrorState;