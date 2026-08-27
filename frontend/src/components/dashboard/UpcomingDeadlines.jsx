import Icon from "../landing/icons";
import { diffDays, formatShortDate, toDateKey } from "./dashboardUtils";
import "./UpcomingDeadlines.css";

function groupDeadlines(tasks) {
  const open = tasks.filter(
    (task) => task.status !== "completed" && task.due_date
  );

  const groups = [];

  const overdue = open
    .filter((task) => diffDays(task.due_date) < 0)
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  if (overdue.length > 0) {
    groups.push({ label: "Overdue", tone: "rose", items: overdue });
  }

  const today = open
    .filter((task) => diffDays(task.due_date) === 0)
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  if (today.length > 0) {
    groups.push({ label: "Today", tone: "amber", items: today });
  }

  const tomorrow = open
    .filter((task) => diffDays(task.due_date) === 1)
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  if (tomorrow.length > 0) {
    groups.push({ label: "Tomorrow", tone: "blue", items: tomorrow });
  }

  const byDate = {};
  for (const task of open) {
    const diff = diffDays(task.due_date);
    if (diff === null || diff <= 1) continue;
    const key = toDateKey(task.due_date);
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(task);
  }

  Object.keys(byDate)
    .sort()
    .forEach((key) => {
      groups.push({
        label: formatShortDate(key).toUpperCase(),
        tone: "neutral",
        items: byDate[key].sort((a, b) => a.due_date.localeCompare(b.due_date)),
      });
    });

  return groups;
}

function UpcomingDeadlines({ tasks = [], tasksError = false }) {
  const groups = groupDeadlines(tasks);

  if (tasksError) {
    return (
      <div className="dash-card ud-error">
        <Icon name="alert" size={16} />
        Couldn't load upcoming deadlines.
      </div>
    );
  }

  return (
    <section className="dash-card ud-card" aria-labelledby="upcoming-title">
      <header className="dash-section-head ud-head">
        <h2 className="dash-section-title" id="upcoming-title">
          Upcoming
        </h2>
        <span className="ud-chip">Upcoming deadlines</span>
      </header>

      {groups.length === 0 ? (
        <p className="ud-empty">No upcoming deadlines.</p>
      ) : (
        <div className="ud-groups">
          {groups.map((group) => (
            <div className={`ud-group is-${group.tone}`} key={group.label}>
              <span className="ud-group-label">
                <span className="ud-group-dot" aria-hidden="true" />
                {group.label}
              </span>
              <ul className="ud-items">
                {group.items.map((item) => (
                  <li className="ud-item" key={item.id}>
                    <span className="ud-title">{item.title}</span>
                    <span className="ud-meta">
                      {item.project_title || "Untitled"} · {formatShortDate(item.due_date)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingDeadlines;