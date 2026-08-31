import { useEffect, useRef, useState } from "react";
import Icon from "../landing/icons";
import { getHue, getInitials } from "../dashboard/dashboardUtils";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import { dueMeta } from "./taskDates";
import "./TaskRow.css";

function TaskRow({ task, onToggleComplete, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const done = task.status === "completed";
  const projectHue = getHue(task.project_title || "");
  const assigneeName = task.assignee_name || "Unassigned";
  const assigneeHue = getHue(assigneeName);
  const due = dueMeta(task.due_date, done);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
      }
    };
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className={`tk-row ${done ? "is-done" : ""}`}>
      <input
        type="checkbox"
        className="tk-check"
        aria-label={`Mark "${task.title}" as ${done ? "not " : ""}complete`}
        checked={done}
        onChange={(event) => onToggleComplete(task, event.target.checked)}
      />

      <div className="tk-title-wrap">
        <span className={`tk-title ${done ? "is-done" : ""}`}>{task.title}</span>
        <span className="tk-meta-sm">
          <span className="tk-meta-project-dot" style={{ background: projectHue }} aria-hidden="true" />
          {task.project_title || "Untitled project"}
          <span aria-hidden="true">·</span>
          {assigneeName}
          <span aria-hidden="true">·</span>
          {due.label}
        </span>
      </div>

      <span className="tk-project">
        <span className="tk-project-dot" style={{ background: projectHue }} aria-hidden="true" />
        {task.project_title || "Untitled project"}
      </span>

      <span className="tk-assignee">
        <span
          className="avatar tk-assignee-avatar"
          style={{ background: assigneeHue }}
          aria-hidden="true"
        >
          {getInitials(assigneeName)}
        </span>
        {assigneeName}
      </span>

      <TaskPriorityBadge priority={task.priority} />

      <TaskStatusBadge status={task.status} />

      <span className={`tk-due ${due.overdue ? "is-overdue" : ""} ${done ? "is-done" : ""}`}>
        {due.overdue ? <Icon name="alert" size={12} /> : null}
        {due.label}
      </span>

      <div className="tk-menu-anchor" ref={menuRef}>
        <button
          type="button"
          className={`tk-more ${menuOpen ? "is-open" : ""}`}
          aria-label={`More options for "${task.title}"`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name="more" size={17} />
        </button>

        {menuOpen && (
          <div className="tk-menu" role="menu" aria-label={`Actions for "${task.title}"`}>
            <button
              type="button"
              role="menuitem"
              className="tk-menu-item"
              onClick={() => {
                setMenuOpen(false);
                onToggleComplete(task, !done);
              }}
            >
              <Icon name="check" size={14} />
              {done ? "Reopen task" : "Mark complete"}
            </button>
            <button
              type="button"
              role="menuitem"
              className="tk-menu-item"
              onClick={() => {
                setMenuOpen(false);
                onEdit(task);
              }}
            >
              <Icon name="settings" size={14} />
              Edit task
            </button>
            <button
              type="button"
              role="menuitem"
              className="tk-menu-item is-danger"
              onClick={() => {
                setMenuOpen(false);
                onDelete(task);
              }}
            >
              <Icon name="x" size={14} />
              Delete task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskRow;