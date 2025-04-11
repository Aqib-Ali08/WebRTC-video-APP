import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/login.css";
import { useLogin } from "../context/loginContext.jsx";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate()
    const {login} = useLogin()
    const handleLogin = async (event) => {
        event.preventDefault();
        setError(""); // Reset error message

        try {
            // const response = await fetch("https://webrtc-backend-vtyh.onrender.com/api/auth/login", {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed. Please check your credentials.");
            }

            const data = await response.json();
            // alert("Login successful! Redirecting...");
            console.log("Login response:", data);
            navigate('/meeting')
            login(data)
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="maincontainer">
            <div className="Logincontainer">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn">Login</button>
                    <div className="link">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
