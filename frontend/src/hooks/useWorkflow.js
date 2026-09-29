import { useCallback } from "react";
import { addEdge } from "@xyflow/react";

import api from "../services/api";

import {
    getWorkflow,
    getWorkflowsGraph
} from "../services/workflowService";

import {
    createConnection
} from "../services/connectionService";

export default function useWorkflow({
    workflowId,
    setNodes,
    setEdges
}) {

    const loadWorkflow = useCallback(async () => {
        try {
            let activeWorkflowId = workflowId;

            if (!activeWorkflowId) {
                const workflows =
                    await getWorkflow();

                if (!workflows.data.length) {
                    return;
                }

                activeWorkflowId =
                    workflows.data[0].id;
            }

            const response =
                await getWorkflowsGraph(
                    activeWorkflowId
                );

            const workflowNodes =
                (response.data.nodes || [])
                    .map((node) => ({
                        id: String(node.id),

                        workflow_id: node.workflow_id,

                        position: {
                            x: Number(node.position_x),
                            y: Number(node.position_y)
                        },

                        data: {
                            label: node.label,
                            type: node.type,
                            config: node.config || {}
                        },

                        type: "custom"
                    }));

            const workflowEdges =
                (response.data.connections || [])
                    .map((connection) => ({
                        id: String(connection.id),

                        source: String(
                            connection.source_node_id
                        ),

                        target: String(
                            connection.target_node_id
                        )
                    }));

            setNodes(workflowNodes);
            setEdges(workflowEdges);

        } catch (error) {
            console.error(
                "Load workflow error:",
                error
            );
        }
    }, [
        workflowId,
        setNodes,
        setEdges
    ]);

    const onConnect = useCallback(
        async (params) => {
            try {
                let activeWorkflowId = workflowId;

                if (!activeWorkflowId) {
                    const workflows =
                        await getWorkflow();

                    if (!workflows.data.length) {
                        return;
                    }

                    activeWorkflowId =
                        workflows.data[0].id;
                }

                const response =
                    await createConnection({
                        workflowId: activeWorkflowId,
                        sourceNodeId:
                            params.source,
                        targetNodeId:
                            params.target
                    });

                const savedConnection =
                    response.data;

                setEdges((eds) =>
                    addEdge(
                        {
                            id: String(
                                savedConnection.id
                            ),
                            source: String(
                                savedConnection.source_node_id
                            ),
                            target: String(
                                savedConnection.target_node_id
                            )
                        },
                        eds
                    )
                );

            } catch (error) {
                console.error(
                    "Connect error:",
                    error
                );
            }
        },
        [workflowId, setEdges]
    );

    const handleNodeDragStop =
        async (_, node) => {
            try {

                await api.put(
                    `/nodes/${node.id}`,
                    {
                        label:
                            node.data.label,

                        position_x:
                            node.position.x,

                        position_y:
                            node.position.y,

                        config:
                            node.data.config || {}
                    }
                );

            } catch (error) {
                console.error(
                    "Drag save error:",
                    error
                );
            }
        };

    return {
        loadWorkflow,
        onConnect,
        handleNodeDragStop
    };
}
