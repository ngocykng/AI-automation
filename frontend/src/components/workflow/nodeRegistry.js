import {
    Sparkles,
    Globe,
    Mail,
    Youtube,
    FileSpreadsheet,
    Download,
} from "lucide-react";

// Central registry for every node type used in the workflow editor.
// Each entry powers three places: the sidebar palette, the canvas node
// rendering, and the settings panel. Add a new node type here and it
// shows up everywhere — no other files need to change.
export const NODE_REGISTRY = {
    ai: {
        type: "ai",
        label: "AI",
        description: "Generate text with Gemini models",
        icon: Sparkles,
        // Tailwind-style palette kept inline-friendly (no CSS framework).
        color: "#7c3aed",        // purple
        bg: "#f3e8ff",           // light purple background
        border: "#c4b5fd",       // hover / accent border
        category: "AI & Logic",
    },
    http: {
        type: "http",
        label: "HTTP Request",
        description: "Call any REST API endpoint",
        icon: Globe,
        color: "#2563eb",        // blue
        bg: "#dbeafe",
        border: "#93c5fd",
        category: "Data & API",
    },
    youtube: {
        type: "youtube",
        label: "YouTube",
        description: "Fetch video data and transcripts",
        icon: Youtube,
        color: "#dc2626",        // red
        bg: "#fee2e2",
        border: "#fca5a5",
        category: "Data & API",
    },
    excel: {
        type: "excel",
        label: "Excel",
        description: "Read and write spreadsheet rows",
        icon: FileSpreadsheet,
        color: "#16a34a",        // green
        bg: "#dcfce7",
        border: "#86efac",
        category: "Data & API",
    },
    email: {
        type: "email",
        label: "Email",
        description: "Send notifications via email",
        icon: Mail,
        color: "#d97706",        // amber
        bg: "#fef3c7",
        border: "#fcd34d",
        category: "Output",
    },
    output: {
        type: "output",
        label: "Output",
        description: "Export final results to Excel",
        icon: Download,
        color: "#475569",        // slate
        bg: "#f1f5f9",
        border: "#cbd5e1",
        category: "Output",
    },
    merge: {
        type: "merge",
        label: "Merge",
        description: "Combine multiple inputs into a single output",
        icon: Sparkles,
        color: "#7c3aed",        // purple
        bg: "#f3e8ff",           // light purple background
        border: "#c4b5fd",       // hover / accent border
        category: "AI & Logic",
    }
};


// Stable display order for the sidebar palette.
export const NODE_ORDER = [
    "ai",
    "http",
    "youtube",
    "excel",
    "email",
    "output",
    "merge"
];

// Helper used by every component that needs a node's visual config.
// Falls back to a neutral "unknown" tile if a backend ever returns a
// type the registry doesn't know about, so the UI never crashes.
export const getNodeConfig = (type) => {
    return (
        NODE_REGISTRY[type] || {
            type: type || "unknown",
            label: type || "Unknown",
            description: "No description available",
            icon: Sparkles,
            color: "#64748b",
            bg: "#f1f5f9",
            border: "#cbd5e1",
            category: "Other",
        }
    );
};

// Group the registry by category so the sidebar can render section
// headers (e.g. "AI & Logic", "Data & API", "Output") in one pass.
export const getNodesByCategory = () => {
    const grouped = {};
    NODE_ORDER.forEach((type) => {
        const cfg = NODE_REGISTRY[type];
        if (!grouped[cfg.category]) {
            grouped[cfg.category] = [];
        }
        grouped[cfg.category].push(cfg);
    });
    return grouped;
};
