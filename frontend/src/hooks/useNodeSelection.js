import { useState } from "react";
import { getNode } from "../services/nodeService";

export default function useNodeSelection() {

    const [selectedNode, setSelectedNode] =
        useState(null);

    const [runResult, setRunResult] =
        useState([]);

    const onNodeClick = async (_, node) => {
        try {

            const response =
                await getNode(node.id);

            setSelectedNode(
                response.data
            );

            setRunResult(
                node.data?.runResult || []
            );

        } catch (error) {
            console.error(error);
        }
    };

    return {
        selectedNode,
        setSelectedNode,
        runResult,
        setRunResult,
        onNodeClick
    };
}