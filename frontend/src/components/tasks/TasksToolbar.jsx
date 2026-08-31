import Icon from "../landing/icons";
import "./TasksToolbar.css";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "All priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const SORT_OPTIONS = [
  { value: "updated", label: "Last updated" },
  { value: "created", label: "Created date" },
  { value: "due", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
];

function FilterSelect({ id, label, options, value, onChange }) {
  return (
    <div className="tk-select">
      <label className="tk-select-label" htmlFor={id}>
        {label}
      </label>
      <div className="tk-select-wrap">
        <select
          id={id}
          className="tk-select-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
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

function TasksToolbar({
  searchValue = "",
  onSearchChange,
  statusValue = "all",
  onStatusChange,
  priorityValue = "all",
  onPriorityChange,
  assigneeValue = "all",
  onAssigneeChange,
  projectValue = "all",
  onProjectChange,
  sortValue = "updated",
  onSortChange,
  members = [],
  projects = [],
  view = "list",
  onViewChange,
}) {
  const assigneeOptions = [
    { value: "all", label: "All assignees" },
    ...members.map((member) => ({
      value: String(member.id),
      label: member.name || member.email,
    })),
  ];

  const projectOptions = [
    { value: "all", label: "All projects" },
    ...projects.map((project) => ({
      value: String(project.id),
      label: project.title,
    })),
  ];

  return (
    <div className="tk-toolbar" role="group" aria-label="Task filters">
      <div className="tk-search">
        <Icon name="search" size={16} className="tk-search-icon" />
        <input
          type="search"
          className="tk-search-input"
          placeholder="Search tasks…"
          aria-label="Search tasks"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="tk-toolbar-right">
        <FilterSelect
          id="tk-status"
          label="Status"
          options={STATUS_OPTIONS}
          value={statusValue}
          onChange={onStatusChange}
        />
        <FilterSelect
          id="tk-priority"
          label="Priority"
          options={PRIORITY_OPTIONS}
          value={priorityValue}
          onChange={onPriorityChange}
        />
        <FilterSelect
          id="tk-assignee"
          label="Assignee"
          options={assigneeOptions}
          value={assigneeValue}
          onChange={onAssigneeChange}
        />
        <FilterSelect
          id="tk-project"
          label="Project"
          options={projectOptions}
          value={projectValue}
          onChange={onProjectChange}
        />
        <FilterSelect
          id="tk-sort"
          label="Sort"
          options={SORT_OPTIONS}
          value={sortValue}
          onChange={onSortChange}
        />

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