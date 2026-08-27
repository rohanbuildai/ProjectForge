import { useEffect, useState } from "react";
import Icon from "../landing/icons";
import api from "../../api/axios";
import "./CreateWorkspaceModal.css";

function CreateWorkspaceModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return console.log("Workspace name is required");
    }

    setCreating(true);

    try {
      const response = await api.post("/workspaces/", {
        name: name.trim(),
        description: description.trim(),
      });

      const created = response.data?.data || null;

      if (onCreated && created) onCreated(created);

      onClose();
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="cw-backdrop" onClick={onClose}>
      <div
        className="cw-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cw-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="cw-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="x" size={18} />
        </button>

        <header className="cw-head">
          <h2 className="cw-title" id="cw-title">
            Create a workspace
          </h2>

          <p className="cw-sub">
            Set up a workspace for your team and projects.
          </p>
        </header>

        <form className="cw-form" onSubmit={handleSubmit}>
          <div className="cw-field">
            <label className="cw-label" htmlFor="cw-name">
              Workspace name
            </label>

            <input
              id="cw-name"
              className="cw-input"
              type="text"
              placeholder="Enter workspace name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="cw-field">
            <label className="cw-label" htmlFor="cw-desc">
              Description <span className="cw-opt">Optional</span>
            </label>

            <textarea
              id="cw-desc"
              className="cw-textarea"
              rows="3"
              placeholder="Tell us about this workspace..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="cw-actions">
            <button
              type="button"
              className="pf-btn pf-btn-ghost cw-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="pf-btn pf-btn-primary cw-btn"
              disabled={creating}
            >
              {creating ? "Creating…" : "Create workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkspaceModal;