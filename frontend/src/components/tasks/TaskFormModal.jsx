import { useEffect, useRef, useState } from "react";
import Icon from "../landing/icons";
import "./TaskFormModal.css";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function TaskFormModal({
  mode = "create",
  initial = {},
  projects = [],
  members = [],
  onClose,
  onSubmit,
}) {
  const editing = mode === "edit";
  const titleRef = useRef(null);

  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [projectId, setProjectId] = useState(
    initial.project_id ? String(initial.project_id) : ""
  );
  const [status, setStatus] = useState(initial.status || "todo");
  const [priority, setPriority] = useState(initial.priority || "medium");
  const [assignee, setAssignee] = useState(
    initial.assignee_id != null ? String(initial.assignee_id) : ""
  );
  const [dueDate, setDueDate] = useState(initial.due_date || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !projectId) {
      setError("Task title and project are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({
        projectId: Number(projectId),
        title: trimmedTitle,
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate || null,
        assignedTo: assignee ? Number(assignee) : null,
        taskId: editing ? initial.id : undefined,
      });
      onClose();
    } catch (err) {
      console.error("Failed to save task:", err);
      setError(
        err.response?.data?.message ||
          "Could not save the task. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tfm-backdrop" onClick={onClose}>
      <div
        className="tfm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tfm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="tfm-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="x" size={18} />
        </button>

        <header className="tfm-head">
          <h2 className="tfm-title" id="tfm-title">
            {editing ? "Edit task" : "Create a task"}
          </h2>
          <p className="tfm-sub">
            {editing
              ? "Update the task details."
              : "Add a task to a project in this workspace."}
          </p>
        </header>

        <form className="tfm-form" onSubmit={handleSubmit}>
          <div className="tfm-field">
            <label className="tfm-label" htmlFor="tfm-title-input">
              Task title
            </label>
            <input
              ref={titleRef}
              id="tfm-title-input"
              className="tfm-input"
              type="text"
              placeholder="Enter task title"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="tfm-field">
            <label className="tfm-label" htmlFor="tfm-desc">
              Description <span className="tfm-opt">Optional</span>
            </label>
            <textarea
              id="tfm-desc"
              className="tfm-textarea"
              rows="3"
              placeholder="Add more context…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="tfm-grid-2">
            <div className="tfm-field">
              <label className="tfm-label" htmlFor="tfm-project">
                Project
              </label>
              <div className="tfm-select-wrap">
                <select
                  id="tfm-project"
                  className="tfm-select"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="" disabled>
                    Select project
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={String(project.id)}>
                      {project.title}
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" size={15} className="tfm-select-chevron" />
              </div>
            </div>

            <div className="tfm-field">
              <label className="tfm-label" htmlFor="tfm-assignee">
                Assignee
              </label>
              <div className="tfm-select-wrap">
                <select
                  id="tfm-assignee"
                  className="tfm-select"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.id} value={String(member.id)}>
                      {member.name || member.email}
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" size={15} className="tfm-select-chevron" />
              </div>
            </div>
          </div>

          <div className="tfm-grid-3">
            <div className="tfm-field">
              <label className="tfm-label" htmlFor="tfm-status">
                Status
              </label>
              <div className="tfm-select-wrap">
                <select
                  id="tfm-status"
                  className="tfm-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" size={15} className="tfm-select-chevron" />
              </div>
            </div>

            <div className="tfm-field">
              <label className="tfm-label" htmlFor="tfm-priority">
                Priority
              </label>
              <div className="tfm-select-wrap">
                <select
                  id="tfm-priority"
                  className="tfm-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" size={15} className="tfm-select-chevron" />
              </div>
            </div>

            <div className="tfm-field">
              <label className="tfm-label" htmlFor="tfm-due">
                Due date
              </label>
              <input
                id="tfm-due"
                className="tfm-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="tfm-error" role="alert">
              <Icon name="alert" size={14} />
              {error}
            </p>
          )}

          <div className="tfm-actions">
            <button
              type="button"
              className="pf-btn pf-btn-ghost tfm-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pf-btn pf-btn-primary tfm-btn"
              disabled={submitting}
            >
              {submitting ? "Saving…" : editing ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal;