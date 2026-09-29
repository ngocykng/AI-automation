// import api from "../services/api";

export default function useNodeActions(
    setNodes
) {

    const updateNode = (
        updatedNode
    ) => {

        setNodes((prev) =>
            prev.map((node) =>
                node.id === updatedNode.id
                    ? updatedNode
                    : node
            )
        );

    };

    const addNode = (
        newNode
    ) => {

        setNodes((prev) => [
            ...prev,
            newNode
        ]);

    };

    const removeNode = (
        nodeId
    ) => {

        setNodes((prev) =>
            prev.filter(
                node => node.id !== nodeId
            )
        );

    };

    return {
        updateNode,
        addNode,
        removeNode
    };
}