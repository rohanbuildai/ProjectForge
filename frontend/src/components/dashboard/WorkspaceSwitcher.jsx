import { useState } from "react";
import Icon from "../landing/icons";
import { getHue, roleLabel } from "./dashboardUtils";
import "./WorkspaceSwitcher.css";

function WorkspaceSwitcher({
  workspaces = [],
  selectedId,
  onSelectWorkspace,
  onCreateWorkspace,
}) {
  const [open, setOpen] = useState(false);
  const current =
    workspaces.find((ws) => Number(ws.id) === Number(selectedId)) ||
    workspaces[0] ||
    null;

  const currentName = current?.name || "No workspace";
  const currentHue = getHue(current?.name);

  const handleSelect = (workspace) => {
    setOpen(false);
    if (onSelectWorkspace) onSelectWorkspace(workspace.id);
  };

  const handleCreate = () => {
    setOpen(false);
    if (onCreateWorkspace) onCreateWorkspace();
  };

  return (
    <div className="ws">
      <span className="ws-label">Workspace</span>

      <button
        type="button"
        className={`ws-trigger ${open ? "is-open" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Current workspace: ${currentName}. Switch workspace`}
        onClick={() => setOpen((value) => !value)}
      >
        <span
          className="ws-mark"
          style={current ? { background: currentHue } : undefined}
        >
          {current ? current.name[0] : ""}
        </span>
        <span className="ws-name">{currentName}</span>
        <Icon name="chevronDown" size={15} className="ws-chevron" />
      </button>

      {open && (
        <div className="ws-pop" role="menu" aria-label="Switch workspace">
          <span className="ws-pop-label">Your workspaces</span>

          <ul className="ws-list">
            {workspaces.map((ws) => {
              const hue = getHue(ws.name);
              const isCurrent = Number(ws.id) === Number(selectedId);

              return (
                <li key={ws.id ?? ws.name}>
                  <button
                    type="button"
                    className={`ws-opt ${isCurrent ? "is-current" : ""}`}
                    role="menuitem"
                    aria-current={isCurrent ? "true" : undefined}
                    onClick={() => handleSelect(ws)}
                  >
                    <span className="ws-opt-mark" style={{ background: hue }}>
                      {ws.name ? ws.name[0] : ""}
                    </span>
                    <span className="ws-opt-meta">
                      <strong>{ws.name}</strong>
                      {ws.description || roleLabel(ws.role) ? (
                        <small>{ws.description || roleLabel(ws.role)}</small>
                      ) : null}
                    </span>
                    {isCurrent && <Icon name="check" size={15} className="ws-opt-check" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <button type="button" className="ws-create" onClick={handleCreate}>
            <Icon name="plus" size={15} />
            Create workspace
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkspaceSwitcher;