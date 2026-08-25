import Icon from "../landing/icons";
import "./AuthBranding.css";

function Logo({ size = 30 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="pf-logo-auth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9b8cff" />
          <stop offset="100%" stopColor="#6a56ff" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="8.5" height="8.5" rx="2.2" fill="url(#pf-logo-auth)" />
      <rect x="13" y="2.5" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.9" />
      <rect x="2.5" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.42" />
      <rect x="13" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.66" />
    </svg>
  );
}

const ROWS = [
  { name: "Dashboard UI", pct: 90, width: "90%", tone: "violet" },
  { name: "Authentication", pct: 63, width: "63%", tone: "cyan" },
  { name: "Notifications", pct: 28, width: "28%", tone: "amber" },
];

const FEED = [
  {
    tone: "violet",
    text: ["Rhea", " moved ", "Build authentication", " to In Progress"],
    time: "9:41",
  },
  {
    tone: "green",
    text: ["Alex", " joined ", "Forge Labs"],
    time: "9:12",
  },
  {
    tone: "amber",
    text: ["Mira", " attached ", "api-spec.pdf"],
    time: "8:50",
  },
];

const TEAM = [
  { ini: "RK", hue: "#7c6cff" },
  { ini: "AD", hue: "#22d3ee" },
  { ini: "MS", hue: "#f472b6" },
];

function AuthBranding({
  headline = "Build. Collaborate.",
  em = "Ship.",
  sub = "Bring your projects, tasks and team together in one powerful workspace.",
}) {
  return (
    <aside className="auth-brand">
      <a href="#top" className="auth-back" onClick={(e) => e.preventDefault()}>
        <Icon name="arrowLeft" size={15} />
        Back to home
      </a>

      <div className="auth-brand-body">
        <span className="auth-brand-logo">
          <Logo />
        </span>

        <h2 className="auth-brand-title">
          {headline} <em>{em}</em>
        </h2>

        <p className="auth-brand-sub">{sub}</p>

        <div className="auth-scene" aria-hidden="true">
          {/* Main overview card */}
          <div className="auth-scene-card">
            <div className="auth-scene-head">
              <span className="auth-scene-ws">
                <span className="auth-scene-ws-mark">F</span>
                <span className="auth-scene-ws-name">Forge Labs</span>
              </span>
              <span className="auth-scene-chip">
                <span className="auth-scene-dot is-green" />
                On track
              </span>
            </div>

            <div className="auth-scene-rows">
              {ROWS.map((row) => (
                <div key={row.name} className="auth-scene-row">
                  <div className="auth-scene-row-top">
                    <span className="auth-scene-row-name">{row.name}</span>
                    <span className="auth-scene-row-pct">{row.pct}%</span>
                  </div>
                  <div className="auth-scene-bar">
                    <span className={`is-${row.tone}`} style={{ width: row.width }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="auth-scene-foot">
              <span className="auth-avatar-stack">
                {TEAM.map((m) => (
                  <span
                    key={m.ini}
                    className="auth-scene-avatar"
                    style={{ background: m.hue }}
                  >
                    {m.ini}
                  </span>
                ))}
                <span className="auth-scene-avatar is-more">+2</span>
              </span>
              <span className="auth-scene-foot-text">
                <Icon name="check" size={13} />
                214 tasks shipped
              </span>
            </div>
          </div>

          {/* Floating activity feed */}
          <div className="auth-scene-feed">
            <div className="auth-scene-feed-head">
              <Icon name="activity" size={13} />
              Recent activity
            </div>
            <ul className="auth-scene-feed-list">
              {FEED.map((item, i) => (
                <li key={i} className="auth-scene-feed-item">
                  <span className={`auth-scene-feed-dot is-${item.tone}`} />
                  <p className="auth-scene-feed-text">
                    {item.text.map((seg, j) =>
                      j % 2 === 1 ? (
                        <strong key={j}>{seg}</strong>
                      ) : (
                        <span key={j}>{seg}</span>
                      )
                    )}
                  </p>
                  <span className="auth-scene-feed-time">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Floating completion ring */}
          <div className="auth-scene-ring">
            <svg viewBox="0 0 72 72" width="60" height="60">
              <circle
                className="auth-scene-ring-track"
                cx="36"
                cy="36"
                r="30"
                pathLength="100"
              />
              <circle
                className="auth-scene-ring-value"
                cx="36"
                cy="36"
                r="30"
                pathLength="100"
                strokeDasharray="78 22"
              />
            </svg>
            <div className="auth-scene-ring-meta">
              <strong>78%</strong>
              <small>sprint shipped</small>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-brand-foot">
        <Icon name="shield" size={14} />
        <span>Workspaces protected with role-based access</span>
      </div>
    </aside>
  );
}

export default AuthBranding;