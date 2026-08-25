import AuthBranding from "../components/auth/AuthBranding";
import LoginForm from "../components/auth/LoginForm";
import "./Login.css";

function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-violet" aria-hidden="true" />
      <div className="auth-glow auth-glow-ember" aria-hidden="true" />
      <div className="auth-grid" aria-hidden="true" />

      <div className="auth-split">
        <AuthBranding />
        <main className="auth-main">
          <LoginForm />
        </main>
      </div>
    </div>
  );
}

export default LoginPage;