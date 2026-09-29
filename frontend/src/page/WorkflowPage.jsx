import { useParams } from "react-router-dom";
import NodePalette from "../components/workflow/Sidebar";
import WorkflowCanvas from "../components/workflow/WorkflowCanvas";

export default function WorkflowPage() {
    const { id } = useParams();

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                width: "100%"
            }}
        >
            {/* LEFT SIDEBAR */}
            <div style={{
                width: "180,180",
                background: "#1e1e1e",
                color: "white",
                overflowY: "auto"
            }}>
                <NodePalette workflowId={id} />
            </div>

            {/* MAIN CANVAS */}
            <div style={{
                flex: 1,
                minWidth: 0
            }}>
                <WorkflowCanvas workflowId={id} />
            </div>
        </div>
    );
}
