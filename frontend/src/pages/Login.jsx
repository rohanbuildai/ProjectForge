import { useState } from "react";
import "../styles/auth/Login.css";
import api from "../api/axios"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        setError("")

        e.preventDefault();

        if (!email || !password) {
            alert("Fill all the fields");
            return;
        }
        try {
            const response = await api.post("/auth/login",
                {
                    email,
                    password,
                }
            );

            navigate("/dashboard")
        }
        catch (error) {
            setError(
                error.response?.data?.message || "Something went wrong."
            );
        }
    }
    return (
        <div className="login-container">

            <div className="login-card">

                <h1>ProjectForge</h1>

                <p>Welcome Back</p>

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit">

                        Login

                    </button>

                    <div className="auth-link">
                        <p>
                            Don't have an account?{" "}
                            <Link to="/register">
                                Register
                            </Link>
                        </p>
                    </div>

                </form>

            </div>

        </div>
    );
}

export default Login;