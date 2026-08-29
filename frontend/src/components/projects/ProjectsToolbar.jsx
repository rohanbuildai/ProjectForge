import Icon from "../landing/icons";
import "./ProjectsToolbar.css";

function ProjectsToolbar() {
  return (
    <div className="pr-toolbar" role="group" aria-label="Project filters">
      <div className="pr-search">
        <Icon name="search" size={16} className="pr-search-icon" />
        <input
          type="search"
          className="pr-search-input"
          placeholder="Search projects…"
          aria-label="Search projects"
        />
      </div>

      <div className="pr-toolbar-right">
        <div className="pr-select">
          <label className="pr-select-label" htmlFor="pr-status-filter">
            Status
          </label>
          <div className="pr-select-wrap">
            <select id="pr-status-filter" className="pr-select-input" defaultValue="all">
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
            <select id="pr-sort" className="pr-select-input" defaultValue="updated">
              <option value="updated">Last updated</option>
              <option value="name">Name</option>
              <option value="progress">Progress</option>
              <option value="created">Created date</option>
            </select>
            <Icon name="chevronDown" size={15} className="pr-select-chevron" />
          </div>
        </div>

        <div className="pr-view" role="group" aria-label="View mode">
          <button type="button" className="pr-view-btn is-active" aria-label="Grid view" aria-pressed="true">
            <Icon name="grid" size={15} />
          </button>
          <button type="button" className="pr-view-btn" aria-label="List view" aria-pressed="false">
            <Icon name="list" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsToolbar;