import Icon from "../landing/icons";
import "./MembersEmptyState.css";

function MembersEmptyState({ variant = "empty", onClearFilters }) {
  return (
    <section className="dash-card mb-es" aria-labelledby="mb-es-title">
      <span className="mb-es-icon" aria-hidden="true">
        <Icon name={variant === "no-results" ? "search" : "users"} size={22} />
      </span>
      <h2 className="mb-es-title" id="mb-es-title">
        {variant === "no-results" ? "No members found" : "No members yet"}
      </h2>
      <p className="mb-es-text">
        {variant === "no-results"
          ? "There are no members matching your current filters."
          : "Invite your first member to start collaborating in this workspace."}
      </p>

      {variant === "no-results" && onClearFilters ? (
        <button
          type="button"
          className="pf-btn pf-btn-ghost mb-es-action"
          onClick={onClearFilters}
        >
          <Icon name="x" size={15} />
          Clear filters
        </button>
      ) : (
        <button type="button" className="pf-btn pf-btn-primary mb-es-action">
          <Icon name="plus" size={15} />
          Invite member
        </button>
      )}
    </section>
  );
}

export default MembersEmptyState;