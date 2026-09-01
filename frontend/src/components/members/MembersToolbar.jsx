import Icon from "../landing/icons";
import "./MembersToolbar.css";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
];

const SORT_OPTIONS = [
  { value: "name", label: "Name A–Z" },
  { value: "joined", label: "Recently joined" },
  { value: "projects", label: "Most projects" },
  { value: "tasks", label: "Most tasks" },
];

function FilterSelect({ id, label, options, value, onChange }) {
  return (
    <div className="mb-select">
      <label className="mb-select-label" htmlFor={id}>
        {label}
      </label>
      <div className="mb-select-wrap">
        <select
          id={id}
          className="mb-select-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" size={15} className="mb-select-chevron" />
      </div>
    </div>
  );
}

function MembersToolbar({
  searchValue = "",
  onSearchChange,
  roleValue = "all",
  onRoleChange,
  statusValue = "all",
  onStatusChange,
  sortValue = "name",
  onSortChange,
  view = "list",
  onViewChange,
}) {
  return (
    <div className="mb-toolbar" role="group" aria-label="Member filters">
      <div className="mb-search">
        <Icon name="search" size={16} className="mb-search-icon" />
        <input
          type="search"
          className="mb-search-input"
          placeholder="Search members…"
          aria-label="Search members"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="mb-toolbar-right">
        <FilterSelect
          id="mb-role"
          label="Role"
          options={ROLE_OPTIONS}
          value={roleValue}
          onChange={onRoleChange}
        />
        <FilterSelect
          id="mb-status"
          label="Status"
          options={STATUS_OPTIONS}
          value={statusValue}
          onChange={onStatusChange}
        />
        <FilterSelect
          id="mb-sort"
          label="Sort"
          options={SORT_OPTIONS}
          value={sortValue}
          onChange={onSortChange}
        />

        <div className="mb-view" role="group" aria-label="View mode">
          <button
            type="button"
            className={`mb-view-btn ${view === "list" ? "is-active" : ""}`}
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
          >
            <Icon name="list" size={16} />
          </button>
          <button
            type="button"
            className={`mb-view-btn ${view === "grid" ? "is-active" : ""}`}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
          >
            <Icon name="grid" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MembersToolbar;