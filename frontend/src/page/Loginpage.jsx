import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login, setToken } from "../services/authService";

export default function Loginpage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await login(email, password);
            setToken(data.token);
            navigate("/workflow");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ maxWidth: 360, margin: "80px auto" }}
        >
            <h2>Login</h2>

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            <label>
                Email
                <br />
                <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <br />

            <label>
                Password
                <br />
                <input
                    type="password"
                    value={password}
                    required
                    minLength={12}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <br />

            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>

            <p>
                No account? <Link to="/register">Register</Link>
            </p>
        </form>
    );
}
