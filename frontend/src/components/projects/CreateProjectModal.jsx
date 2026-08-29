import { useEffect, useRef, useState } from "react";
import Icon from "../landing/icons";
import api from "../../api/axios";
import "./CreateProjectModal.css";

function CreateProjectModal({ workspaceId, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef(null);

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

    if (!trimmedTitle) {
      setError("Project name is required.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const response = await api.post(`/workspaces/${workspaceId}/projects`, {
        title: trimmedTitle,
        description: description.trim(),
      });

      if (response.data?.success && onCreated) onCreated();

      onClose();
    } catch (err) {
      console.error("Failed to create project:", err);
      setError(
        err.response?.data?.message ||
          "Could not create the project. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="cp-backdrop" onClick={onClose}>
      <div
        className="cp-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cp-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="cp-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="x" size={18} />
        </button>

        <header className="cp-head">
          <h2 className="cp-title" id="cp-title">
            Create a project
          </h2>
          <p className="cp-sub">
            Set up a project to plan work, track tasks, and keep your team
            aligned.
          </p>
        </header>

        <form className="cp-form" onSubmit={handleSubmit}>
          <div className="cp-field">
            <label className="cp-label" htmlFor="cp-title-input">
              Project name
            </label>
            <input
              ref={titleRef}
              id="cp-title-input"
              className="cp-input"
              type="text"
              placeholder="Enter project name"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="cp-field">
            <label className="cp-label" htmlFor="cp-desc">
              Description <span className="cp-opt">Optional</span>
            </label>
            <textarea
              id="cp-desc"
              className="cp-textarea"
              rows="3"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p className="cp-error" role="alert">
              <Icon name="alert" size={14} />
              {error}
            </p>
          )}

          <div className="cp-actions">
            <button
              type="button"
              className="pf-btn pf-btn-ghost cp-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pf-btn pf-btn-primary cp-btn"
              disabled={creating}
            >
              {creating ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;