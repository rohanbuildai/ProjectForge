import Reveal from "./Reveal";
import Icon from "./icons";
import "./ProductShowcase.css";

const COLUMNS = [
  {
    title: "Todo",
    tone: "todo",
    count: 4,
    tasks: [
      {
        title: "Design landing page",
        priority: "High",
        pTone: "red",
        due: "Aug 28",
        progress: 0,
        avatars: [
          { ini: "RK", hue: "#7c6cff" },
          { ini: "AD", hue: "#f97316" },
        ],
      },
      {
        title: "Research competitor workflows",
        priority: "Medium",
        pTone: "amber",
        due: "Aug 29",
        avatars: [{ ini: "SM", hue: "#22d3ee" }],
      },
      {
        title: "Set up CI pipeline",
        priority: "Low",
        pTone: "gray",
        due: "Sep 02",
        avatars: [{ ini: "JL", hue: "#4ade80" }],
      },
      {
        title: "Write test plan for auth",
        priority: "Medium",
        pTone: "amber",
        due: "Sep 04",
        avatars: [{ ini: "PT", hue: "#f472b6" }],
      },
    ],
  },
  {
    title: "In Progress",
    tone: "progress",
    count: 3,
    tasks: [
      {
        title: "Build authentication flow",
        priority: "High",
        pTone: "red",
        due: "Aug 30",
        progress: 62,
        avatars: [
          { ini: "RK", hue: "#7c6cff" },
          { ini: "JL", hue: "#4ade80" },
          { ini: "AD", hue: "#f97316" },
        ],
      },
      {
        title: "Implement notifications",
        priority: "High",
        pTone: "red",
        due: "Sep 01",
        progress: 40,
        avatars: [{ ini: "SM", hue: "#22d3ee" }],
      },
      {
        title: "Create database architecture",
        priority: "Medium",
        pTone: "amber",
        due: "Sep 03",
        progress: 78,
        avatars: [
          { ini: "PT", hue: "#f472b6" },
          { ini: "RK", hue: "#7c6cff" },
        ],
      },
    ],
  },
  {
    title: "Completed",
    tone: "done",
    count: 3,
    tasks: [
      {
        title: "Deploy backend",
        priority: "Low",
        pTone: "gray",
        due: "Shipped",
        done: true,
        avatars: [{ ini: "RK", hue: "#7c6cff" }],
      },
      {
        title: "Configure workspaces",
        priority: "Medium",
        pTone: "amber",
        due: "Shipped",
        done: true,
        avatars: [
          { ini: "AD", hue: "#f97316" },
          { ini: "SM", hue: "#22d3ee" },
        ],
      },
      {
        title: "Set up project structure",
        priority: "Low",
        pTone: "gray",
        due: "Shipped",
        done: true,
        avatars: [{ ini: "JL", hue: "#4ade80" }],
      },
    ],
  },
];

function PriorityBadge({ label, tone }) {
  return <span className={`kan-priority tone-${tone}`}>{label}</span>;
}

function KanbanCard({ task, tone }) {
  return (
    <div className="kan-card">
      <div className="kan-card-top">
        {task.done ? (
          <span className="kan-done-check">
            <Icon name="check" size={12} strokeWidth={2.6} />
          </span>
        ) : (
          <span className={`kan-dot tone-${tone}`} />
        )}
        <PriorityBadge label={task.priority} tone={task.pTone} />
      </div>

      <h4 className={`kan-card-title ${task.done ? "is-done" : ""}`}>
        {task.title}
      </h4>

      {task.progress > 0 && (
        <div className="kan-progress-row">
          <div className="kan-progress">
            <span style={{ width: `${task.progress}%` }} />
          </div>
          <span className="kan-progress-val">{task.progress}%</span>
        </div>
      )}

      <div className="kan-card-foot">
        <span className="kan-due">
          <Icon name={task.done ? "check" : "clock"} size={12} />
          {task.due}
        </span>
        <span className="kan-avatars">
          {task.avatars.map((a) => (
            <span
              key={a.ini}
              className="avatar"
              style={{ background: a.hue }}
            >
              {a.ini}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function ProductShowcase() {
  return (
    <section className="showcase" id="showcase">
      <div className="pf-container">
        <Reveal className="pf-section-header center">
          <span className="pf-kicker">In the flow</span>
          <h2 className="pf-title">
            Watch work move from <em>idea to shipped.</em>
          </h2>
          <p className="pf-lead">
            A board that feels native — swimlanes, priority, ownership, and
            due dates on every card, with zero clutter.
          </p>
        </Reveal>

        <Reveal className="board-wrap" delay={120}>
          <div className="kan-board">
            {COLUMNS.map((col) => (
              <div key={col.title} className="kan-col">
                <div className="kan-col-head">
                  <span className={`kan-col-dot tone-${col.tone}`} />
                  <h3 className="kan-col-title">{col.title}</h3>
                  <span className="kan-col-count">{col.count}</span>
                </div>
                <div className="kan-col-list">
                  {col.tasks.map((t) => (
                    <KanbanCard key={t.title} task={t} tone={col.tone} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default ProductShowcase;