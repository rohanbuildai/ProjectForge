import Reveal from "./Reveal";
import Icon from "./icons";
import "./AIFuture.css";

const METRICS = [
  { label: "Tasks completed", value: "12", icon: "check", tone: "green" },
  { label: "Tasks delayed", value: "3", icon: "clock", tone: "amber" },
  { label: "Blockers detected", value: "2", icon: "target", tone: "rose" },
];

const SUGGESTIONS = [
  "Generate release notes",
  "Summarize this sprint",
  "Estimate velocity",
];

function AIFuture() {
  return (
    <section className="ai" id="ai">
      <div className="ai-glow" aria-hidden="true" />
      <div className="pf-container">
        <Reveal className="pf-section-header center">
          <span className="pf-kicker">Future vision</span>
          <h2 className="pf-title">
            Your workspace, <em>understood.</em>
          </h2>
          <p className="pf-lead">
            ProjectForge AI will read your projects, tasks, and history to
            surface context — before you even ask.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="ai-window">
            <div className="ai-window-head">
              <span className="ai-pill">ProjectForge AI</span>
              <span className="ai-pill is-muted">Concept</span>
            </div>

            <div className="ai-prompt">
              <span className="ai-prompt-mark">
                <Icon name="sparkle" size={16} />
              </span>
              <span className="ai-prompt-text">Summarize this sprint</span>
              <span className="ai-prompt-send">
                <Icon name="arrowRight" size={15} />
              </span>
            </div>

            <div className="ai-response">
              <div className="ai-response-label">
                <span className="ai-cursor" />
                Analyzing 47 tasks across 4 projects…
              </div>

              <h3 className="ai-summary-title">
                Sprint 14 — mild delays, backend on watch.
              </h3>
              <p className="ai-summary-text">
                Overall velocity held steady. Two issues need attention:
                authentication is spending longer than planned, and the
                release branch is one workday behind schedule.
              </p>

              <div className="ai-metrics">
                {METRICS.map((m) => (
                  <div key={m.label} className={`ai-metric tone-${m.tone}`}>
                    <span className="ai-metric-icon">
                      <Icon name={m.icon} size={15} />
                    </span>
                    <div className="ai-metric-meta">
                      <strong>{m.value}</strong>
                      <small>{m.label}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ai-insight">
                <Icon name="target" size={16} className="ai-insight-icon" />
                <p>
                  <strong>Backend milestone may be at risk.</strong> Move
                  “Implement notifications” to the top of next week.
                </p>
              </div>
            </div>

            <div className="ai-suggestions">
              {SUGGESTIONS.map((s) => (
                <span key={s} className="ai-chip">
                  <Icon name="sparkle" size={12} />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default AIFuture;