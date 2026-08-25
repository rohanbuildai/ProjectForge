import Reveal from "./Reveal";
import Icon from "./icons";
import "./Features.css";

const FEATURES = [
  {
    icon: "folder",
    title: "Projects",
    text: "Plan and organize work in flexible projects — from focused sprints to sprawling initiatives.",
    tone: "violet",
  },
  {
    icon: "task",
    title: "Tasks",
    text: "Break work into tasks with priorities, statuses, due dates, and clear assignees.",
    tone: "blue",
  },
  {
    icon: "message",
    title: "Collaboration",
    text: "Comment, mention, and decide in one place so context stays with the work.",
    tone: "green",
  },
  {
    icon: "layers",
    title: "Workspaces",
    text: "Isolate teams, clients, and projects in secure, permissioned workspaces.",
    tone: "amber",
  },
  {
    icon: "bell",
    title: "Notifications",
    text: "Know what matters — assignments, status changes, and mentions the moment they happen.",
    tone: "rose",
  },
  {
    icon: "activity",
    title: "Activity",
    text: "Follow everything happening across your workspace with a complete activity trace.",
    tone: "cyan",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="pf-container">
        <Reveal className="pf-section-header center">
          <span className="pf-kicker">Features</span>
          <h2 className="pf-title">
            Everything your team needs. <em>One workspace.</em>
          </h2>
          <p className="pf-lead">
            ProjectForge brings planning, execution, and communication into a
            single connected surface — so nothing falls through the cracks.
          </p>
        </Reveal>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="feature-card">
                <div className={`feature-icon tone-${f.tone}`}>
                  <Icon name={f.icon} size={20} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-text">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;