import { useEffect, useRef } from "react";
import Icon from "../landing/icons";
import "./TaskDeleteConfirm.css";

function TaskDeleteConfirm({ task, deleting, error, onConfirm, onClose }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div className="tdc-backdrop" onClick={onClose}>
      <div
        className="tdc-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="tdc-title"
        aria-describedby="tdc-text"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="tdc-icon" aria-hidden="true">
          <Icon name="alert" size={20} />
        </span>

        <h2 className="tdc-title" id="tdc-title">
          Delete task?
        </h2>
        <p className="tdc-text" id="tdc-text">
          “{task?.title}” will be permanently removed from{" "}
          {task?.project_title || "its project"}.
        </p>

        {error && (
          <p className="tdc-error" role="alert">
            <Icon name="alert" size={14} />
            {error}
          </p>
        )}

        <div className="tdc-actions">
          <button
            ref={cancelRef}
            type="button"
            className="pf-btn pf-btn-ghost tdc-btn"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="pf-btn tdc-btn tdc-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDeleteConfirm;