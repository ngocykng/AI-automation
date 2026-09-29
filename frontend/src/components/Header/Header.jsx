import { Link, useNavigate } from "react-router-dom";

import { clearToken, getToken } from "../../services/authService";

export default function Header() {
    const navigate = useNavigate();
    const token = getToken();

    const handleLogout = () => {
        clearToken();
        navigate("/login");
    };

    return (
        <header
            style={{
                height: "60px",
                background: "#111827",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                borderBottom: "1px solid #374151"
            }}
        >
            <h2
                style={{
                    margin: 0
                }}
            >
                AI Automation
            </h2>

            <nav
                style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center"
                }}
            >
                <Link
                    to="/"
                    style={{
                        color: "white",
                        textDecoration: "none"
                    }}
                >
                    Home
                </Link>

                <Link
                    to="/workflow"
                    style={{
                        color: "white",
                        textDecoration: "none"
                    }}
                >
                    Workflow
                </Link>

                {token ? (
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "transparent",
                            color: "white",
                            border: "1px solid #4b5563",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        style={{
                            color: "white",
                            textDecoration: "none"
                        }}
                    >
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
}