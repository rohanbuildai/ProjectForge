import Icon from "../landing/icons";
import "./ProjectsErrorState.css";

function ProjectsErrorState({ onRetry }) {
  return (
    <section className="pr-err" aria-labelledby="pr-err-title" role="alert">
      <div className="dash-card pr-err-card">
        <span className="pr-err-icon" aria-hidden="true">
          <Icon name="alert" size={22} />
        </span>
        <h2 className="pr-err-title" id="pr-err-title">
          Couldn't load projects
        </h2>
        <p className="pr-err-text">
          We ran into a problem fetching your projects. Please try again.
        </p>
        <button
          type="button"
          className="pf-btn pf-btn-ghost pr-err-action"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    </section>
  );
}

export default ProjectsErrorState;