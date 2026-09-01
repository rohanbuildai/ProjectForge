import { useEffect, useRef, useState } from "react";
import Icon from "../landing/icons";
import "./InviteMemberModal.css";

const ROLE_OPTIONS = [
  { value: "MEMBER", label: "Member" },
  { value: "ADMIN", label: "Admin" },
];

function InviteMemberModal({ onClose, onSubmit }) {
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      setError("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({ email: trimmed, role });
      onClose();
    } catch (err) {
      console.error("Failed to send invitation:", err);
      setError(
        err.response?.data?.message ||
          "Could not send the invitation. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="imm-backdrop" onClick={onClose}>
      <div
        className="imm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="imm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="imm-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="x" size={18} />
        </button>

        <header className="imm-head">
          <h2 className="imm-title" id="imm-title">
            Invite member
          </h2>
          <p className="imm-sub">
            Send an invitation to join this workspace.
          </p>
        </header>

        <form className="imm-form" onSubmit={handleSubmit}>
          <div className="imm-field">
            <label className="imm-label" htmlFor="imm-email">
              Email address
            </label>
            <input
              ref={emailRef}
              id="imm-email"
              className="imm-input"
              type="email"
              placeholder="colleague@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="imm-field">
            <label className="imm-label" htmlFor="imm-role">
              Role
            </label>
            <div className="imm-select-wrap">
              <select
                id="imm-role"
                className="imm-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={15} className="imm-select-chevron" />
            </div>
          </div>

          {error && (
            <p className="imm-error" role="alert">
              <Icon name="alert" size={14} />
              {error}
            </p>
          )}

          <div className="imm-actions">
            <button
              type="button"
              className="pf-btn pf-btn-ghost imm-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pf-btn pf-btn-primary imm-btn"
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Send invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteMemberModal;
