import api from "../services/api";

export default function useRunWorkflow(
    workflowId,
    setRunResult,
    setNodes) {
    const runWorkflow = async () => {

        try {
            let activeWorkflowId = workflowId;

            if (!activeWorkflowId) {
                const workflows = await api.get("/workflows");

                if (!workflows.data.length) return;

                activeWorkflowId = workflows.data[0].id;
            }

            const response = await api.post(
                `/workflows/${activeWorkflowId}/run`,
                {
                    input: "Xin chào AI"
                }
            );
            const result = response.data;
            setRunResult(response.data);

            setNodes((prev) =>
                prev.map((node) => {
                    if (
                        node.type === "output" ||
                        node.data?.type === "output"
                    ) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                status: "success",
                                result: result,
                                count: Array.isArray(result)
                                    ? result.length
                                    : 1
                            }
                        };
                    }
                    return node;
                })
            );

        } catch (error) {
            console.error(error);
        }
    };

    return { runWorkflow };
}
