import Reveal from "./Reveal";
import Icon from "./icons";
import "./Collaboration.css";

const COMMENTS = [
  {
    name: "Rhea Kapoor",
    role: "Tech Lead",
    hue: "#7c6cff",
    time: "12m ago",
    text:
      "Build is green. Tagging @alex for a final review before we cut the release branch.",
    attachment: true,
  },
  {
    name: "Alex Dutta",
    role: "Backend Engineer",
    hue: "#22d3ee",
    time: "8m ago",
    text: "Merged to main — deploy pipeline triggered. Monitoring the rollout.",
    attachment: false,
  },
  {
    name: "Mira Shah",
    role: "Product",
    hue: "#f472b6",
    time: "3m ago",
    text: "Looks great. Updating the QA checklist for the new auth flow.",
    attachment: true,
  },
];

const ACTIVITY = [
  { icon: "plus", tone: "violet", who: "Rhea", what: "created task", when: "9:41" },
  { icon: "arrowRight", tone: "blue", who: "Alex", what: "moved Deploy backend to In Progress", when: "9:12" },
  { icon: "message", tone: "green", who: "Mira", what: "commented on Design landing page", when: "8:50" },
  { icon: "paperclip", tone: "amber", who: "Rhea", what: "uploaded api-spec.md", when: "8:26" },
  { icon: "check", tone: "green", who: "Sam", what: "completed Set up CI pipeline", when: "7:58" },
];

const FILES = [
  { name: "design-system.pdf", size: "2.4 MB", tone: "rose" },
  { name: "api-spec.md", size: "48 KB", tone: "violet" },
  { name: "dashboard-preview.png", size: "1.1 MB", tone: "cyan" },
];

const TEAM = [
  { ini: "RK", name: "Rhea Kapoor", role: "Owner", hue: "#7c6cff" },
  { ini: "AD", name: "Alex Dutta", role: "Admin", hue: "#22d3ee" },
  { ini: "MS", name: "Mira Shah", role: "Admin", hue: "#f472b6" },
  { ini: "SL", name: "Sam Lee", role: "Member", hue: "#4ade80" },
];

function Avatar({ name, hue, size = "md" }) {
  return (
    <span className={`collab-avatar is-${size}`} style={{ background: hue }}>
      {name}
    </span>
  );
}

function Collaboration() {
  return (
    <section className="collab" id="about">
      <div className="pf-container">
        <Reveal className="pf-section-header center">
          <span className="pf-kicker">Collaboration</span>
          <h2 className="pf-title">
            Decisions live with the <em>work.</em>
          </h2>
          <p className="pf-lead">
            Comments, files, and a full activity trail — so every conversation
            has context and every change has an author.
          </p>
        </Reveal>

        <div className="collab-grid">
          {/* Left — task discussion */}
          <Reveal delay={80}>
            <div className="collab-panel collab-discussion">
              <div className="collab-panel-head">
                <div>
                  <h3 className="collab-task-title">Deploy backend</h3>
                  <div className="collab-task-meta">
                    <span className="collab-chip is-green">In Progress</span>
                    <span className="collab-chip is-red">High</span>
                    <span className="collab-chip is-muted">
                      <Icon name="calendar" size={12} /> Aug 30
                    </span>
                  </div>
                </div>
                <span className="collab-people">
                  {TEAM.slice(0, 3).map((m) => (
                    <Avatar key={m.ini} name={m.ini} hue={m.hue} size="sm" />
                  ))}
                </span>
              </div>

              <div className="collab-thread">
                {COMMENTS.map((c) => (
                  <div key={c.name + c.time} className="collab-comment">
                    <Avatar name={c.name.slice(0, 1)} hue={c.hue} />
                    <div className="collab-comment-body">
                      <div className="collab-comment-meta">
                        <strong>{c.name}</strong>
                        <span className="collab-comment-name">{c.role}</span>
                        <span className="collab-comment-time">{c.time}</span>
                      </div>
                      <p className="collab-comment-text">{c.text}</p>
                      {c.attachment && (
                        <span className="collab-comment-link">
                          <Icon name="paperclip" size={11} />
                          spec-v2.pdf
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="collab-compose">
                <Avatar name="You" hue="#7c6cff" size="sm" />
                <span className="collab-compose-input">
                  Write a comment…
                  <span className="collab-compose-meta">⌘↵ to send</span>
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right rail */}
          <div className="collab-rail">
            <Reveal delay={140}>
              <div className="collab-panel">
                <h4 className="collab-rail-title">Activity</h4>
                <ul className="collab-feed">
                  {ACTIVITY.map((a, i) => (
                    <li key={i} className="collab-feed-item">
                      <span className={`collab-feed-icon tone-${a.tone}`}>
                        <Icon name={a.icon} size={13} />
                      </span>
                      <p className="collab-feed-text">
                        <strong>{a.who}</strong> {a.what}
                      </p>
                      <span className="collab-feed-time">{a.when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="collab-panel">
                <h4 className="collab-rail-title">Attachments</h4>
                <ul className="collab-files">
                  {FILES.map((f) => (
                    <li key={f.name} className="collab-file">
                      <span className={`collab-file-icon is-${f.tone}`}>
                        <Icon name="file" size={15} />
                      </span>
                      <span className="collab-file-meta">
                        <strong>{f.name}</strong>
                        <small>{f.size}</small>
                      </span>
                      <Icon name="arrowRight" size={14} className="collab-file-arrow" />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="collab-panel">
                <h4 className="collab-rail-title">Team</h4>
                <ul className="collab-team">
                  {TEAM.map((m) => (
                    <li key={m.ini} className="collab-team-item">
                      <Avatar name={m.ini} hue={m.hue} size="sm" />
                      <span className="collab-team-meta">
                        <strong>{m.name}</strong>
                        <small>{m.role}</small>
                      </span>
                      <span className={`collab-role-dot is-${m.role.toLowerCase()}`} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Collaboration;