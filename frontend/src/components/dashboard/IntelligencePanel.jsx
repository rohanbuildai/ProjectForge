import Icon from "../landing/icons";
import "./IntelligencePanel.css";

const SUGGESTIONS = [
  "Summarize this sprint",
  "Which tasks are at risk?",
  "Plan tomorrow's priorities",
];

function IntelligencePanel({ user, workspace, statistics, insights, tasksError }) {
  const projects = statistics?.totalProjects ?? 0;
  const tasks = statistics?.totalTasks ?? 0;

  return (
    <section className="dash-section ai-panel" aria-labelledby="ai-panel-title">
      <div className="dash-card ai-card">
        <span className="ai-aurora" aria-hidden="true" />

        <header className="ai-head">
          <span className="ai-title" id="ai-panel-title">
            <Icon name="sparkle" size={17} className="ai-title-star" />
            ProjectForge Intelligence
          </span>
          <span className="ai-status">
            <span className="ai-status-pulse" aria-hidden="true" />
            Observing workspace
          </span>
        </header>

        <div className="ai-body">
          <div className="ai-daily">
            <p className="ai-kicker">Workspace brief</p>
            <h3 className="ai-daily-title">Good morning, {user?.name || "there"}.</h3>
            <p className="ai-daily-text">
              {workspace ? (
                <>
                  Your workspace has <strong>{projects} project{projects === 1 ? "" : "s"}</strong> and{" "}
                  <strong>{tasks} task{tasks === 1 ? "" : "s"}</strong>.
                </>
              ) : (
                "Your workspace data is loading."
              )}
            </p>
            <div className="ai-actions">
              <button type="button" className="pf-btn pf-btn-ghost pf-btn-sm ai-action">
                Review today's tasks
              </button>
              <button type="button" className="pf-btn pf-btn-primary pf-btn-sm ai-action">
                Ask ProjectForge AI
                <Icon name="arrowRight" size={15} className="pf-icon-arrow" />
              </button>
            </div>
            <p className="ai-note">
              <Icon name="activity" size={13} />
              Computed from {workspace?.name || "this workspace"} data
            </p>
          </div>

          <ul className="ai-insights">
            {tasksError ? (
              <li className="ai-insight tone-amber">
                <div className="ai-insight-top">
                  <span className="ai-insight-icon">
                    <Icon name="alert" size={15} />
                  </span>
                  <strong className="ai-insight-title">Couldn't analyze tasks</strong>
                </div>
                <p className="ai-insight-text">
                  Statistics are still available, but task-level insights couldn't be loaded.
                </p>
              </li>
            ) : (
              insights.map((insight) => (
                <li className={`ai-insight tone-${insight.tone}`} key={insight.title}>
                  <div className="ai-insight-top">
                    <span className="ai-insight-icon">
                      <Icon name={insight.icon} size={15} />
                    </span>
                    <strong className="ai-insight-title">{insight.title}</strong>
                  </div>
                  <p className="ai-insight-text">{insight.text}</p>
                  <button type="button" className="ai-insight-action">
                    {insight.action}
                    <Icon name="arrowRight" size={13} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="ai-ask">
          <span className="ai-ask-star">
            <Icon name="sparkle" size={15} />
          </span>
          <span className="ai-ask-placeholder">Ask anything about your workspace…</span>
          <div className="ai-ask-chips" aria-hidden="true">
            {SUGGESTIONS.map((s) => (
              <span className="ai-ask-chip" key={s}>
                {s}
              </span>
            ))}
          </div>
          <button type="button" className="ai-ask-send" aria-label="Ask ProjectForge AI">
            <Icon name="arrowRight" size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default IntelligencePanel;