import "./TaskBadges.css";

const PRIORITY_META = {
  high: { label: "High", tone: "high" },
  medium: { label: "Medium", tone: "medium" },
  low: { label: "Low", tone: "low" },
};

function TaskPriorityBadge({ priority = "medium" }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.medium;

  return <span className={`tk-badge tk-priority p-${meta.tone}`}>{meta.label}</span>;
}

export default TaskPriorityBadge;