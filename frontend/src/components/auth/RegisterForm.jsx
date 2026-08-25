import Icon from "../landing/icons";
import PasswordInput from "./PasswordInput";
import "./LoginForm.css";
import { useState } from "react";
import api from "../../api/axios" ;
import { useNavigate } from "react-router-dom";

function prevent(e) {
  e.preventDefault();
}

function RegisterForm() {

  const [ name , setName ] = useState("") ; 
  const [ email , setEmail ] = useState("") ; 
  const [ password , setPassword ] = useState("") ; 
  const [ confirmPassword , setConfirmPassword ] = useState("") ; 
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  function redirectToLogin() {
    navigate("/login") ;
  }

  const handleSubmit = async (e) => {
      e.preventDefault() ;

      if ( !name || name.trim() === "" || name === undefined ) {
        return console.log("name error")
      } 

      if ( !email || email === undefined ) {
        return console.log("email error")
      }

      if ( !password ) {
        return console.log("password error")
      }

      if (password.length < 8) {
          return console.log("Password must be at least 8 characters");
      }

      if ( !confirmPassword || confirmPassword === undefined ) {
        return console.log("confirm password error")
      }

      if ( confirmPassword !== password ) {
        return console.log("confirm password must be same as password")
      }

      try {
        setServerError("");
        setLoading(true);


        await api.post("/auth/register" , {
        name : name.trim() ,
        email : email.trim(),
        password
      })

      navigate("/login") ;

      }catch (error) {
        console.error("Registration failed:", error);

        setServerError(
          error.response?.data?.message ||
          "Something went wrong. Please try again."
        );
      } finally {
      
        setLoading(false);
    }
      
  }

  return (
    <div className="auth-card">
      <header className="auth-card-head">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">
          Start organizing your projects and teams in one place.
        </p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="name">
            Full name
          </label>

          <div className="auth-input-wrap">
            <span className="auth-field-icon">
              <Icon name="users" size={16} />
            </span>

            <input
              id="name"
              type="text"
              className="auth-input"
              placeholder="Your full name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-email">
            Email
          </label>

          <div className="auth-input-wrap">
            <span className="auth-field-icon">
              <Icon name="mail" size={16} />
            </span>

            <input
              id="register-email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <PasswordInput
          id="register-password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          id="register-confirm"
          label="Confirm password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {serverError && (
            <p className="auth-server-error">
              {serverError}
            </p>
          )}

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}>
          <span>
            {loading ? "Creating account..." : "Create account"}
          </span>

          {!loading && (
            <Icon
              name="arrowRight"
              size={16}
              className="pf-icon-arrow"
            />
          )}
        </button>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <a href="#sign-in" className="auth-create" onClick={redirectToLogin}>
          Sign in
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

export default RegisterForm;