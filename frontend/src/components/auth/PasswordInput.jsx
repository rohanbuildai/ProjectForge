import { useState } from "react";
import Icon from "../landing/icons";
import "./PasswordInput.css";

function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete = "off"
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>

      <div className="auth-input-wrap is-password">
        <span className="auth-field-icon">
          <Icon name="lock" size={16} />
        </span>

        <input
          id={id}
          type={visible ? "text" : "password"}
          className="auth-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <button
          type="button"
          className="auth-eyeball"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={17} />
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;