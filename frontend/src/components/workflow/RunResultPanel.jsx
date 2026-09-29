import { useState } from "react";
import { Check, Copy, Terminal, X, ChevronDown, ChevronUp } from "lucide-react";

// Slide-up panel anchored to the bottom of the editor. Used to
// inspect the output of the most recent run for the selected node.
// Two states: collapsed (a thin status bar) and expanded (the full
// JSON). Clicking the toggle button or the bar itself switches
// between them.
export default function RunResultPanel({
    selectedNode,
    runResult,
}) {
    const [expanded, setExpanded] = useState(true);
    const [copied, setCopied] = useState(false);

    if (!selectedNode) return null;

    // Pick the latest entry matching this node from the run history.
    const nodeResult = runResult.find(
        (r) => r.nodeId === selectedNode.id
    );

    const output = nodeResult ? nodeResult.output : null;
    const outputText = output
        ? JSON.stringify(output, null, 2)
        : "No result for this node yet.";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(outputText);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    return (
        <div
            style={{
                ...styles.panel,
                transform: expanded
                    ? "translateY(0)"
                    : "translateY(calc(100% - 44px))",
            }}
        >
            {/* Header strip — always visible. Click to toggle. */}
            <div
                style={styles.header}
                onClick={() => setExpanded((v) => !v)}
            >
                <div style={styles.headerLeft}>
                    <div style={styles.iconWrap}>
                        <Terminal size={14} strokeWidth={2.4} />
                    </div>
                    <div>
                        <div style={styles.title}>Run output</div>
                        <div style={styles.subtitle}>
                            Node {selectedNode.id.slice(0, 8)} ·{" "}
                            {runResult.length} run
                            {runResult.length === 1 ? "" : "s"}
                        </div>
                    </div>
                </div>

                <div style={styles.headerRight}>
                    {expanded && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy();
                            }}
                            style={styles.copyBtn}
                            title="Copy JSON"
                        >
                            {copied ? (
                                <>
                                    <Check size={13} strokeWidth={2.4} />
                                    <span>Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={13} strokeWidth={2.4} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((v) => !v);
                        }}
                        style={styles.iconBtn}
                        title={expanded ? "Collapse" : "Expand"}
                    >
                        {expanded ? (
                            <ChevronDown size={15} strokeWidth={2.4} />
                        ) : (
                            <ChevronUp size={15} strokeWidth={2.4} />
                        )}
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(false);
                        }}
                        style={styles.iconBtn}
                        title="Close"
                    >
                        <X size={15} strokeWidth={2.4} />
                    </button>
                </div>
            </div>

            {/* Body: formatted JSON */}
            {expanded && (
                <div style={styles.body}>
                    <pre style={styles.pre}>{outputText}</pre>
                </div>
            )}
        </div>
    );
}

const styles = {
    panel: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -4px 16px rgba(15, 23, 42, 0.06)",
        zIndex: 50,
        transition: "transform 0.25s ease",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        maxHeight: "60%",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
        flexShrink: 0,
        padding: "0 16px",
        cursor: "pointer",
        borderBottom: "1px solid #f1f5f9",
        userSelect: "none",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    iconWrap: {
        width: 26,
        height: 26,
        background: "#0f172a",
        color: "#ffffff",
        borderRadius: 7,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 12,
        fontWeight: 600,
        color: "#0f172a",
        lineHeight: 1.2,
    },
    subtitle: {
        fontSize: 11,
        color: "#94a3b8",
        marginTop: 1,
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    copyBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: 28,
        padding: "0 10px",
        fontSize: 12,
        fontWeight: 600,
        color: "#475569",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        cursor: "pointer",
        fontFamily: "inherit",
    },
    iconBtn: {
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        borderRadius: 6,
        color: "#64748b",
        cursor: "pointer",
    },
    body: {
        flex: 1,
        overflow: "auto",
        background: "#0f172a",
    },
    pre: {
        margin: 0,
        padding: "14px 16px",
        fontSize: 12,
        lineHeight: 1.5,
        color: "#e2e8f0",
        fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
    },
};
