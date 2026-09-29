import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login, register, setToken } from "../services/authService";

export default function Registerpage() {
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
            await register(email, password);
            // Backend register doesn't return a token — auto-login after signup.
            const { data } = await login(email, password);
            setToken(data.token);
            navigate("/workflow");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ maxWidth: 360, margin: "80px auto" }}
        >
            <h2>Register</h2>

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
                Password (min 12 characters)
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
                {loading ? "Creating account..." : "Register"}
            </button>

            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </form>
    );
}
