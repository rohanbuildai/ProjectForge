import api from "../api/axios";
import "../styles/auth/Login.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            alert("Please enter all ther fields")
            return
        }

        try {
            const response = await api.post("/auth/register",
                {
                    name,
                    email,
                    password,
                }
            )

            navigate("/", {
                state: {
                    success: "Account created successfully. Please log in.",
                },
            });
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

                <p>Create your account</p>

                <form onSubmit={handleRegister}>

                    <div className="form-group">

                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>

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

                    {success && (
                        <p className="success-message">
                            {success}
                        </p>
                    )}

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button type="submit">
                        Register
                    </button>

                    <div className="auth-link">
                        <p>
                            Already have an account?{" "}
                            <Link to="/">
                                Login
                            </Link>
                        </p>
                    </div>

                </form>

            </div>

        </div>
    );
}

export default Register;