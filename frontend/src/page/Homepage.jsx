import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createWorkflow,
    getWorkflow
} from "../services/workflowService";

export default function HomePage() {
    const navigate = useNavigate();

    const [openCreate, setOpenCreate] = useState(false);
    const [openList, setOpenList] = useState(false);

    const [name, setName] = useState("");
    const [workflows, setWorkflows] = useState([]);

    const handleCreate = async () => {
        try {
            if (!name.trim()) {
                alert("Enter workflow name");
                return;
            }

            const { data } = await createWorkflow({
                name: name.trim(),
                description: ""
            });

            const workflow = Array.isArray(data)
                ? data[0]
                : data;

            if (!workflow?.id) {
                throw new Error("Workflow id not found");
            }

            navigate(`/workflow/${workflow.id}`);

        } catch (err) {
            console.error(err);
        }
    };

    const loadWorkflows = async () => {
        try {
            const { data } = await getWorkflow();

            setWorkflows(data);
            setOpenList(true);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.logo}>
                    ⚡ AI Workflow
                </div>

                <div style={styles.nav}>
                    <button
                        style={styles.btn}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        style={{
                            ...styles.btn,
                            background: "#4f46e5"
                        }}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </div>
            </header>

            {/* HERO */}
            <div style={styles.hero}>
                <h1 style={styles.title}>
                    Build AI Workflows Visually
                </h1>

                <p style={styles.subtitle}>
                    Connect YouTube, HTTP and AI nodes visually
                </p>

                <div style={styles.actions}>

                    <button
                        style={styles.primaryBtn}
                        onClick={() => setOpenCreate(true)}
                    >
                        🚀 Create Workflow
                    </button>

                    <button
                        style={styles.secondaryBtn}
                        onClick={loadWorkflows}
                    >
                        📂 My Workflows
                    </button>

                </div>
            </div>

            {/* FEATURES */}
            <div style={styles.features}>
                <div style={styles.card}>
                    🧩 Drag & Drop Nodes
                </div>

                <div style={styles.card}>
                    🤖 AI Processing
                </div>

                <div style={styles.card}>
                    🔗 HTTP + YouTube
                </div>
            </div>

            {/* CREATE MODAL */}
            {openCreate && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>

                        <h3>Create Workflow</h3>

                        <input
                            placeholder="Workflow name..."
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            style={styles.input}
                        />

                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                marginTop: 20
                            }}
                        >
                            <button
                                style={styles.primaryBtn}
                                onClick={handleCreate}
                            >
                                Create
                            </button>

                            <button
                                style={styles.secondaryBtn}
                                onClick={() =>
                                    setOpenCreate(false)
                                }
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* WORKFLOW LIST MODAL */}
            {openList && (
                <div style={styles.modalOverlay}>
                    <div style={styles.workflowModal}>

                        <div style={styles.modalHeader}>
                            <h2>📂 My Workflows</h2>

                            <button
                                style={styles.closeBtn}
                                onClick={() => setOpenList(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.workflowContainer}>
                            {workflows.map((workflow) => (
                                <div
                                    key={workflow.id}
                                    style={styles.workflowCard}
                                >
                                    <div>
                                        <h3>{workflow.name}</h3>

                                        <p>
                                            Workflow ID:
                                            {workflow.id.slice(0, 8)}
                                        </p>
                                    </div>

                                    <button
                                        style={styles.openBtn}
                                        onClick={() => {
                                            setOpenList(false);

                                            navigate(
                                                `/workflow/${workflow.id}`
                                            );
                                        }}
                                    >
                                        Open
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

const styles = {

    page: {
        background: "#0b0b0f",
        color: "white",
        minHeight: "100vh",
        fontFamily: "Arial"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid #222"
    },

    logo: {
        fontWeight: "bold",
        fontSize: "20px"
    },

    nav: {
        display: "flex",
        gap: "10px"
    },

    btn: {
        padding: "8px 14px",
        background: "#222",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },

    hero: {
        textAlign: "center",
        padding: "80px 20px"
    },

    title: {
        fontSize: "48px"
    },

    subtitle: {
        color: "#aaa",
        marginTop: "10px"
    },

    actions: {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        marginTop: "30px"
    },

    primaryBtn: {
        padding: "12px 18px",
        background: "#4f46e5",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },

    secondaryBtn: {
        padding: "12px 18px",
        background: "#222",
        color: "white",
        border: "1px solid #333",
        borderRadius: "8px",
        cursor: "pointer"
    },

    features: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "50px"
    },

    card: {
        background: "#111",
        border: "1px solid #222",
        borderRadius: "10px",
        padding: "20px"
    },

    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
    },

    modal: {
        width: "400px",
        background: "white",
        color: "black",
        padding: "20px",
        borderRadius: "10px"
    },

    input: {
        width: "100%",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },

    workflowItem: {
        padding: "12px",
        marginTop: "10px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        cursor: "pointer"
    },
    workflowModal: {
        width: "800px",
        maxHeight: "80vh",
        overflowY: "auto",
        background: "#111827",
        borderRadius: "16px",
        padding: "24px",
        color: "white"
    },

    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },

    closeBtn: {
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "20px",
        cursor: "pointer"
    },

    workflowContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    workflowCard: {
        background: "#1f2937",
        border: "1px solid #374151",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    openBtn: {
        padding: "10px 20px",
        background: "#4f46e5",
        border: "none",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer"
    },
};
