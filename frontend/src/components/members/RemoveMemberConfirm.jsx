import { useEffect, useRef, useState } from "react";
import Icon from "../landing/icons";
import "./RemoveMemberConfirm.css";

function RemoveMemberConfirm({ member, onConfirm, onClose }) {
  const cancelRef = useRef(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

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

  const handleConfirm = async () => {
    setDeleting(true);
    setError("");

    try {
      await onConfirm({ memberId: member.id });
      onClose();
    } catch (err) {
      console.error("Failed to remove member:", err);
      setError(
        err.response?.data?.message ||
          "Could not remove the member. Please try again."
      );
      setDeleting(false);
    }
  };

  const displayName = member?.name || member?.email || "this member";

  return (
    <div className="rmc-backdrop" onClick={onClose}>
      <div
        className="rmc-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="rmc-title"
        aria-describedby="rmc-text"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="rmc-icon" aria-hidden="true">
          <Icon name="alert" size={20} />
        </span>

        <h2 className="rmc-title" id="rmc-title">
          Remove member?
        </h2>
        <p className="rmc-text" id="rmc-text">
          <strong>{displayName}</strong> will be removed from this workspace.
          They will lose access to all projects and tasks.
        </p>

        {error && (
          <p className="rmc-error" role="alert">
            <Icon name="alert" size={14} />
            {error}
          </p>
        )}

        <div className="rmc-actions">
          <button
            ref={cancelRef}
            type="button"
            className="pf-btn pf-btn-ghost rmc-btn"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="pf-btn rmc-btn rmc-danger"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? "Removing…" : "Remove member"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveMemberConfirm;
