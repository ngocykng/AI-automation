import { Play, Save, Download, Workflow } from "lucide-react";

// Sticky top toolbar for the editor. Stays visible while the user
// scrolls/zooms the canvas. Primary action (Run) is the only
// filled button — secondary actions are outlined so the eye lands
// on Run first.
export default function RunToolbar({ onRun, onSave, workflowName }) {
    return (
        <div style={styles.bar}>
            {/* Left: workflow identity */}
            <div style={styles.left}>
                <div style={styles.logo}>
                    <Workflow size={18} color="#2563eb" strokeWidth={2.2} />
                </div>
                <div>
                    <div style={styles.name}>
                        {workflowName || "Untitled workflow"}
                    </div>
                    <div style={styles.sub}>Visual editor</div>
                </div>
            </div>

            {/* Right: actions. Run is the primary CTA. */}
            <div style={styles.actions}>
                {onSave && (
                    <button
                        onClick={onSave}
                        style={{ ...styles.btn, ...styles.btnGhost }}
                    >
                        <Save size={15} strokeWidth={2.2} />
                        <span>Save</span>
                    </button>
                )}

                <button
                    onClick={onRun}
                    style={{ ...styles.btn, ...styles.btnPrimary }}
                >
                    <Play size={15} strokeWidth={2.2} fill="currentColor" />
                    <span>Run workflow</span>
                </button>

                <button
                    style={{ ...styles.btn, ...styles.btnGhost }}
                    title="Export"
                >
                    <Download size={15} strokeWidth={2.2} />
                </button>
            </div>
        </div>
    );
}

const styles = {
    bar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        flexShrink: 0,
        padding: "0 20px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    left: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    logo: {
        width: 36,
        height: 36,
        background: "#eff6ff",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    name: {
        fontSize: 14,
        fontWeight: 600,
        color: "#0f172a",
        lineHeight: 1.2,
    },
    sub: {
        fontSize: 11,
        color: "#94a3b8",
        marginTop: 2,
    },
    actions: {
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    btn: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 36,
        padding: "0 14px",
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.15s ease",
        border: "1px solid transparent",
        fontFamily: "inherit",
    },
    btnGhost: {
        background: "#ffffff",
        color: "#475569",
        borderColor: "#e2e8f0",
    },
    btnPrimary: {
        background: "#10b981",
        color: "#ffffff",
        borderColor: "#10b981",
        boxShadow: "0 1px 2px rgba(16, 185, 129, 0.2)",
    },
};
