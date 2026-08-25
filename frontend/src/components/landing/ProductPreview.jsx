import Icon from "./icons";
import "./ProductPreview.css";

const MEMBERS = [
  { ini: "RK", hue: "#7c6cff" },
  { ini: "AD", hue: "#f97316" },
  { ini: "SM", hue: "#22d3ee" },
  { ini: "JL", hue: "#4ade80" },
  { ini: "PT", hue: "#f472b6" },
];

const NAV = [
  { icon: "dashboard", label: "Dashboard", active: false },
  { icon: "folder", label: "Projects", active: true },
  { icon: "task", label: "Tasks", active: false },
  { icon: "layers", label: "Workspaces", active: false },
  { icon: "message", label: "Comments", active: false },
  { icon: "bell", label: "Notifications", active: false },
  { icon: "activity", label: "Activity", active: false },
  { icon: "settings", label: "Settings", active: false },
];

const STATS = [
  { label: "Active Projects", value: "12", trend: "+2 this month", icon: "folder", tone: "violet" },
  { label: "Open Tasks", value: "89", trend: "34 due this week", icon: "task", tone: "blue" },
  { label: "Completed", value: "214", trend: "92% on time", icon: "check", tone: "green" },
];

const ROWS = [
  {
    name: "ProjectForge Web",
    desc: "Landing + app shell",
    progress: 78,
    hue: "#7c6cff",
    due: "Aug 30",
    badge: "On track",
    tone: "green",
  },
  {
    name: "Mobile App",
    desc: "React Native",
    progress: 54,
    hue: "#22d3ee",
    due: "Sep 12",
    badge: "In progress",
    tone: "blue",
  },
  {
    name: "Data Pipeline",
    desc: "ETL + analytics",
    progress: 91,
    hue: "#4ade80",
    due: "Sep 02",
    badge: "At risk",
    tone: "amber",
  },
  {
    name: "Backend v2",
    desc: "Services rewrite",
    progress: 33,
    hue: "#f472b6",
    due: "Oct 05",
    badge: "In progress",
    tone: "blue",
  },
];

function Badge({ text, tone }) {
  return <span className={`prev-tag tone-${tone}`}>{text}</span>;
}

function ProductPreview() {
  return (
    <section className="preview" id="product">
      <div className="pf-container">
        <div className="preview-window">
          {/* Browser chrome */}
          <div className="preview-topbar">
            <div className="preview-dots">
              <span /> <span /> <span />
            </div>
            <div className="preview-url">
              <Icon name="lock" size={12} className="preview-url-lock" />
              app.projectforge.io/workspace/forge-labs
            </div>
            <span className="preview-topbar-spacer" />
          </div>

          <div className="preview-body">
            {/* Sidebar */}
            <aside className="preview-side">
              <div className="preview-ws">
                <span className="preview-ws-mark">F</span>
                <span className="preview-ws-name">Forge Labs</span>
                <Icon name="chevronDown" size={14} className="preview-ws-caret" />
              </div>

              <nav className="preview-nav">
                {NAV.map((item) => (
                  <div
                    key={item.label}
                    className={`preview-nav-item ${item.active ? "is-active" : ""}`}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                    {item.label === "Notifications" && (
                      <span className="preview-nav-badge">3</span>
                    )}
                  </div>
                ))}
              </nav>

              <div className="preview-side-foot">
                <div className="preview-usage">
                  <div className="preview-usage-top">
                    <span>Storage</span>
                    <span className="mono">2.4 GB / 10 GB</span>
                  </div>
                  <div className="preview-usage-bar">
                    <span style={{ width: "24%" }} />
                  </div>
                </div>
                <div className="preview-user">
                  <span className="avatar" style={{ background: "#7c6cff" }}>
                    AR
                  </span>
                  <span className="preview-user-meta">
                    <strong>Aarav R.</strong>
                    <small>Owner</small>
                  </span>
                  <Icon name="settings" size={15} className="preview-user-cog" />
                </div>
              </div>
            </aside>

            {/* Main */}
            <main className="preview-main">
              <div className="preview-mainbar">
                <div>
                  <h3 className="preview-page-title">
                    Projects
                    <span className="preview-count">12</span>
                  </h3>
                  <p className="preview-crumb">Forge Labs / Projects</p>
                </div>
                <div className="preview-mainbar-right">
                  <div className="preview-search">
                    <Icon name="search" size={14} />
                    <span>Search projects…</span>
                    <kbd>⌘K</kbd>
                  </div>
                  <div className="preview-bell">
                    <Icon name="bell" size={16} />
                    <span className="preview-bell-dot" />
                  </div>
                  <div className="preview-avatars">
                    {MEMBERS.slice(0, 3).map((m) => (
                      <span
                        key={m.ini}
                        className="avatar"
                        style={{ background: m.hue }}
                      >
                        {m.ini}
                      </span>
                    ))}
                    <span className="avatar-more">+2</span>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="preview-stats">
                {STATS.map((s) => (
                  <div key={s.label} className="preview-stat">
                    <div className={`preview-stat-icon tone-${s.tone}`}>
                      <Icon name={s.icon} size={16} />
                    </div>
                    <div className="preview-stat-meta">
                      <span className="preview-stat-label">{s.label}</span>
                      <strong className="preview-stat-value">{s.value}</strong>
                      <small className="preview-stat-delta">{s.trend}</small>
                    </div>
                    <div className="preview-spark" aria-hidden="true">
                      <svg viewBox="0 0 40 22" fill="none" width="40" height="22">
                        <path d="M1 18 L9 12 L17 15 L25 7 L33 10 L39 3" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="preview-table">
                <div className="preview-table-head">
                  <span>Project</span>
                  <span>Progress</span>
                  <span>Due</span>
                  <span>Status</span>
                </div>
                {ROWS.map((r) => (
                  <div key={r.name} className="preview-row">
                    <div className="preview-cell name">
                      <span className="preview-project-icon" style={{ background: r.hue }}>
                        {r.name.charAt(0)}
                      </span>
                      <span className="preview-project-meta">
                        <strong>{r.name}</strong>
                        <small>{r.desc}</small>
                      </span>
                    </div>
                    <div className="preview-cell progress">
                      <div className="preview-progress">
                        <span style={{ width: `${r.progress}%`, background: r.hue }} />
                      </div>
                      <span className="mono preview-progress-val">{r.progress}%</span>
                    </div>
                    <div className="preview-cell due">
                      <Icon name="calendar" size={13} />
                      <span>{r.due}</span>
                    </div>
                    <div className="preview-cell status">
                      <Badge text={r.badge} tone={r.tone} />
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductPreview;