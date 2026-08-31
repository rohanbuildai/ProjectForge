import Icon from "../landing/icons";
import "./TasksToolbar.css";

const FILTER_OPTIONS = {
  status: [
    { value: "all", label: "All statuses" },
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ],
  priority: [
    { value: "all", label: "All priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ],
  assignee: [
    { value: "all", label: "All assignees" },
    { value: "JD", label: "JD" },
    { value: "MK", label: "MK" },
    { value: "RS", label: "RS" },
  ],
  project: [
    { value: "all", label: "All projects" },
    { value: "backend", label: "Backend Migration" },
    { value: "website", label: "Website Redesign" },
    { value: "brand", label: "Brand Refresh" },
  ],
  sort: [
    { value: "updated", label: "Last updated" },
    { value: "created", label: "Created date" },
    { value: "due", label: "Due date" },
    { value: "priority", label: "Priority" },
  ],
};

function FilterSelect({ id, label, options, defaultValue = "all" }) {
  return (
    <div className="tk-select">
      <label className="tk-select-label" htmlFor={id}>
        {label}
      </label>
      <div className="tk-select-wrap">
        <select id={id} className="tk-select-input" defaultValue={defaultValue}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" size={15} className="tk-select-chevron" />
      </div>
    </div>
  );
}

function TasksToolbar({ view = "list", onViewChange }) {
  return (
    <div className="tk-toolbar" role="group" aria-label="Task filters">
      <div className="tk-search">
        <Icon name="search" size={16} className="tk-search-icon" />
        <input
          type="search"
          className="tk-search-input"
          placeholder="Search tasks…"
          aria-label="Search tasks"
        />
      </div>

      <div className="tk-toolbar-right">
        <FilterSelect id="tk-status" label="Status" options={FILTER_OPTIONS.status} />
        <FilterSelect id="tk-priority" label="Priority" options={FILTER_OPTIONS.priority} />
        <FilterSelect id="tk-assignee" label="Assignee" options={FILTER_OPTIONS.assignee} />
        <FilterSelect id="tk-project" label="Project" options={FILTER_OPTIONS.project} />
        <FilterSelect id="tk-sort" label="Sort" options={FILTER_OPTIONS.sort} defaultValue="updated" />

        <div className="tk-view" role="group" aria-label="View mode">
          <button
            type="button"
            className={`tk-view-btn ${view === "list" ? "is-active" : ""}`}
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
          >
            <Icon name="list" size={16} />
          </button>
          <button
            type="button"
            className={`tk-view-btn ${view === "board" ? "is-active" : ""}`}
            aria-label="Board view"
            aria-pressed={view === "board"}
            onClick={() => onViewChange("board")}
          >
            <Icon name="grid" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TasksToolbar;