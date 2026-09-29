import {
    useEffect,
    useCallback,
    useRef,
} from "react";

import {
    useNodesState,//quảng lý trạng thái của các node
    useEdgesState,//quản lý trạng thái của các edge,các edge là các kết nối giữa các node
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import api from "../../services/api";

import CustomNode from "../nodes/CustomNode";
import NodeSidebar from "./NodeSidebar";
import useWorkflow from "../../hooks/useWorkflow";
import RunResultPanel
    from "./RunResultPanel";
import RunToolbar
    from "./RunToolbar";
import ReactFlowArea
    from "./ReactFlowArea";
import useNodeDrag
    from "../../hooks/useDrag";
import useRunWorkflow
    from "../../hooks/useRunWorkflow";
import useNodeActions
    from "../../hooks/useNodeActions";
import useNodeSelection
    from "../../hooks/useNodeSelection";

// Top-level editor shell. Owns the workflow state and stitches
// together the toolbar, canvas, palette, settings panel, and result
// panel. The layout is a 3-column flex: toolbar (top, full width),
// then [palette | canvas | settings] below.
export default function WorkflowCanvas({
    workflowId
}) {

    const [
        nodes,
        setNodes,
        onNodesChange
    ] = useNodesState([]);

    const [
        edges,
        setEdges,
        onEdgesChange
    ] = useEdgesState([]);

    const {
        selectedNode,
        setSelectedNode,
        runResult,
        setRunResult,
        onNodeClick
    } = useNodeSelection();

    const reactFlowWrapper =
        useRef(null);
    const {
        loadWorkflow,
        onConnect
    } = useWorkflow({
        workflowId,
        setNodes,
        setEdges
    });

    const {
        handleNodeDragStop
    } = useNodeDrag();
    const {
        runWorkflow
    } = useRunWorkflow(
        workflowId,
        setRunResult,
        setNodes
    );
    const {
        updateNode
    } = useNodeActions(
        setNodes
    );

    useEffect(() => {
        loadWorkflow();
    }, [loadWorkflow]);

    const onDragOver =
        useCallback((event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        }, []);

    const onDrop =
        useCallback(async (event) => {
            event.preventDefault();

            const type =
                event.dataTransfer.getData(
                    "application/reactflow"
                );

            if (!type) return;

            try {
                const bounds =
                    reactFlowWrapper.current.getBoundingClientRect();

                const position = {
                    x: event.clientX - bounds.left,
                    y: event.clientY - bounds.top
                };

                if (!workflowId) return;

                const response =
                    await api.post("/nodes", {
                        workflowId,
                        type,
                        label: `${type} node`,
                        position_x: position.x,
                        position_y: position.y,
                        config: {}
                    });

                const savedNode =
                    response.data;

                setNodes((nds) => [
                    ...nds,
                    {
                        id: String(savedNode.id),
                        type: "custom",
                        position: {
                            x: Number(savedNode.position_x),
                            y: Number(savedNode.position_y)
                        },
                        data: {
                            label: savedNode.label,
                            type: savedNode.type
                        }
                    }
                ]);

            } catch (error) {
                console.error(
                    "Drop error:",
                    error
                );
            }
        }, [setNodes]);

    return (
        <div style={styles.shell}>
            {/* Sticky toolbar at the very top */}
            <RunToolbar onRun={runWorkflow} />

            {/* Three-column workspace: palette | canvas | settings */}
            <div style={styles.workspace}>
                <div
                    ref={reactFlowWrapper}
                    style={styles.canvasArea}
                >
                    <ReactFlowArea
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeDragStop={handleNodeDragStop}
                        onNodeClick={onNodeClick}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={{ custom: CustomNode }}
                    />
                </div>

                {/* Settings panel slides in from the right when a
                    node is selected; null otherwise so it doesn't
                    take up space. */}
                {selectedNode && (
                    <NodeSidebar
                        selectedNode={selectedNode}
                        setSelectedNode={setSelectedNode}
                        updateNode={updateNode}
                        loadWorkflow={loadWorkflow}
                        setNodes={setNodes}
                    />
                )}
            </div>

            {/* Result panel sits over the bottom of the canvas when
                a node is selected — animation is handled inside. */}
            <RunResultPanel
                selectedNode={selectedNode}
                runResult={runResult}
            />
        </div>
    );
}

const styles = {
    shell: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        background: "#f8fafc",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
    },
    workspace: {
        flex: 1,
        display: "flex",
        minHeight: 0, // important: lets the canvas shrink instead of overflowing
        position: "relative",
    },
    canvasArea: {
        flex: 1,
        minWidth: 0,
        position: "relative",
        background: "#f8fafc",
    },
};
