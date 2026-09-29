import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { getNodeConfig } from "../workflow/nodeRegistry";
import "./CustomNode.css";

// Custom node renderer used by every node on the canvas. Reads its
// visual config from nodeRegistry so each type gets its own color,
// icon, and category. Selected state is provided by @xyflow/react
// via the `selected` prop — we use it to draw a focus ring.
function CustomNode({ data, selected }) {
    const config = getNodeConfig(data?.type);
    const Icon = config.icon;

    // Display helpers — keep the body compact so long configs don't
    // blow up the node height on the canvas.
    const modelName = data?.config?.model;
    const promptText = data?.config?.prompt || data?.label || "";

    return (
        <div
            className={`custom-node ${selected ? "is-selected" : ""}`}
            style={{
                "--node-color": config.color,
                "--node-bg": config.bg,
                "--node-border": config.border,
            }}
        >
            {/* Input handle on the left edge */}
            <Handle
                type="target"
                position={Position.Left}
                className="custom-node-handle"
            />

            {/* Header: icon chip + label + type badge */}
            <div className="custom-node-header">
                <div
                    className="custom-node-icon"
                    style={{
                        background: config.bg,
                        color: config.color,
                        borderColor: config.border,
                    }}
                >
                    <Icon size={16} strokeWidth={2.4} />
                </div>

                <div className="custom-node-title">
                    <div className="custom-node-label">
                        {data?.label || config.label}
                    </div>
                    <div className="custom-node-type">
                        {config.label}
                    </div>
                </div>
            </div>

            {/* Body: config preview. We try to show whatever the node
                has configured so the user can recognize it at a glance
                without opening the settings panel. */}
            <div className="custom-node-body">
                {modelName && (
                    <div className="custom-node-row">
                        <span className="custom-node-key">Model</span>
                        <span className="custom-node-val">{modelName}</span>
                    </div>
                )}
                {promptText && (
                    <div className="custom-node-prompt">
                        {promptText.length > 60
                            ? promptText.slice(0, 60) + "…"
                            : promptText}
                    </div>
                )}
            </div>

            {/* Output handle on the right edge */}
            <Handle
                type="source"
                position={Position.Right}
                className="custom-node-handle"
            />
        </div>
    );
}

export default memo(CustomNode);
