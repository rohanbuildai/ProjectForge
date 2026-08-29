import Icon from "../landing/icons";
import "./ProjectsToolbar.css";

function ProjectsToolbar({
  searchValue = "",
  onSearchChange,
  statusValue = "all",
  onStatusChange,
  sortValue = "updated",
  onSortChange,
  view = "grid",
  onViewChange,
}) {
  return (
    <div className="pr-toolbar" role="group" aria-label="Project filters">
      <div className="pr-search">
        <Icon name="search" size={16} className="pr-search-icon" />
        <input
          type="search"
          className="pr-search-input"
          placeholder="Search projects…"
          aria-label="Search projects"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="pr-toolbar-right">
        <div className="pr-select">
          <label className="pr-select-label" htmlFor="pr-status-filter">
            Status
          </label>
          <div className="pr-select-wrap">
            <select
              id="pr-status-filter"
              className="pr-select-input"
              value={statusValue}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
            <Icon name="chevronDown" size={15} className="pr-select-chevron" />
          </div>
        </div>

        <div className="pr-select">
          <label className="pr-select-label" htmlFor="pr-sort">
            Sort
          </label>
          <div className="pr-select-wrap">
            <select
              id="pr-sort"
              className="pr-select-input"
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
            >
              <option value="updated">Last updated</option>
              <option value="name">Name</option>
              <option value="progress">Progress</option>
              <option value="created">Created date</option>
            </select>
            <Icon name="chevronDown" size={15} className="pr-select-chevron" />
          </div>
        </div>

        <div className="pr-view" role="group" aria-label="View mode">
          <button
            type="button"
            className={`pr-view-btn ${view === "grid" ? "is-active" : ""}`}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
          >
            <Icon name="grid" size={15} />
          </button>
          <button
            type="button"
            className={`pr-view-btn ${view === "list" ? "is-active" : ""}`}
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
          >
            <Icon name="list" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsToolbar;