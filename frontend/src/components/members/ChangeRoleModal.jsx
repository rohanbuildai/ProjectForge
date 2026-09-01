import { useEffect, useState } from "react";
import Icon from "../landing/icons";
import "./ChangeRoleModal.css";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "MEMBER", label: "Member" },
];

function ChangeRoleModal({ member, onClose, onSubmit }) {
  const currentRole = (member?.role || "").toUpperCase();
  const [newRole, setNewRole] = useState(
    currentRole === "OWNER" ? "ADMIN" : currentRole
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newRole === currentRole) {
      setError("Member already has this role.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({ memberId: member.id, role: newRole });
      onClose();
    } catch (err) {
      console.error("Failed to change role:", err);
      setError(
        err.response?.data?.message ||
          "Could not change the role. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="crm-backdrop" onClick={onClose}>
      <div
        className="crm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="crm-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="x" size={18} />
        </button>

        <header className="crm-head">
          <h2 className="crm-title" id="crm-title">
            Change role
          </h2>
          <p className="crm-sub">
            Update the role for{" "}
            <strong>{member?.name || member?.email || "this member"}</strong>.
          </p>
        </header>

        <form className="crm-form" onSubmit={handleSubmit}>
          <div className="crm-field">
            <label className="crm-label" htmlFor="crm-role">
              New role
            </label>
            <div className="crm-select-wrap">
              <select
                id="crm-role"
                className="crm-select"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={15} className="crm-select-chevron" />
            </div>
          </div>

          {error && (
            <p className="crm-error" role="alert">
              <Icon name="alert" size={14} />
              {error}
            </p>
          )}

          <div className="crm-actions">
            <button
              type="button"
              className="pf-btn pf-btn-ghost crm-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pf-btn pf-btn-primary crm-btn"
              disabled={submitting || newRole === currentRole}
            >
              {submitting ? "Saving…" : "Save role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeRoleModal;
