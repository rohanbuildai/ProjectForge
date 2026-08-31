import "./TaskBadges.css";

const STATUS_META = {
  todo: { label: "Todo", tone: "neutral" },
  in_progress: { label: "In Progress", tone: "violet" },
  completed: { label: "Completed", tone: "green" },
};

function TaskStatusBadge({ status = "todo" }) {
  const meta = STATUS_META[status] || STATUS_META.todo;

  return (
    <span className={`tk-badge tk-status tone-${meta.tone}`}>
      <span className="tk-badge-dot" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export default TaskStatusBadge;