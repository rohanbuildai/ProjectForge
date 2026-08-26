import Icon from "../landing/icons";
import PasswordInput from "./PasswordInput";
import "./LoginForm.css";
import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function prevent(e) {
  e.preventDefault();
}

function LoginForm() {

  const [ email , setEmail ] = useState("") ; 
  const [ password , setPassword ] = useState("") ;

  const [errors, setErrors] = useState({});
  const [ loading , setLoading ] = useState("") ;
  const navigate = useNavigate();

  function redirectToRegister() {
    navigate("/register")
  }

  function redirectToDashboard() {
    navigate("/dashboard")
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  if (!email.trim()) {
    newErrors.email = "Email is required.";
  }

  if (!password.trim()) {
    newErrors.password = "Password is required.";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return;
  }

  setLoading(true) ;

  try {
    
    const response = await api.post("/auth/login" , {
      email : email.trim() ,
      password
    })

    redirectToDashboard()

    console.log(response)

  }catch (error) {
    console.error("Login failed:", error);
  } finally {
    setLoading(false);
  }

};

  return (
    <div className="auth-card">
      <header className="auth-card-head">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue to your workspace.</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">
            Email
          </label>

          <div className="auth-input-wrap">
            <span className="auth-field-icon">
              <Icon name="mail" size={16} />
            </span>

            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              autoComplete="off"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value) ;

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev ,
                    email : "" ,
                  })) ;
                }
              }}
            />

            {errors.email && (
              <p className="auth-error">{errors.email}</p>
            )}
          </div>
        </div>

        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
                setPassword(e.target.value);

                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }
              }}
              error={errors.password}
        />

        <div className="auth-row">
          <a
            href="#forgot-password"
            className="auth-link"
            onClick={prevent}
          >
            Forgot password?
          </a>
        </div>

        <button type="submit" className="auth-submit" disabled = {loading}>
          <span>{loading ? "Signing in..." : "Sign in"}</span>
          {!loading && (
            <Icon
              name="arrowRight"
              size={16}
              className="pf-icon-arrow"
            />
          )}
        </button>

        <div className="auth-divider">
          <span>New to ProjectForge?</span>
        </div>

        <a href="#create-account" className="auth-create" onClick={redirectToRegister}>
          Create account
          <Icon name="arrowRight" size={15} />
        </a>
      </form>

      <p className="auth-legal">
        <Icon name="shield" size={13} />
        Protected by role-based access and encrypted sessions
      </p>
    </div>
  );
}

export default LoginForm;