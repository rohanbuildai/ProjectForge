import AuthBranding from "../components/auth/AuthBranding";
import RegisterForm from "../components/auth/RegisterForm";
import "./Login.css";

function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-violet" aria-hidden="true" />
      <div className="auth-glow auth-glow-ember" aria-hidden="true" />
      <div className="auth-grid" aria-hidden="true" />

      <div className="auth-split">
        <AuthBranding
          headline="Build something great"
          em="together."
          sub="Create your ProjectForge account and bring your projects, tasks and team together in one powerful workspace."
        />
        <main className="auth-main">
          <RegisterForm />
        </main>
      </div>
    </div>
  );
}

export default RegisterPage;