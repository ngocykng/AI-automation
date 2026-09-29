import {
    ReactFlow,
    Background,
    Controls
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import CustomNode from "../nodes/CustomNode";

export default function ReactFlowArea({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    onNodeClick,
    onDrop,
    onDragOver
}) {

    const nodeTypes = {
        custom: CustomNode
    };

    return (

        <ReactFlow
            style={{ width: "100%", height: "100%" }}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
        >
            <Background />
            <Controls />
        </ReactFlow>
    );
}