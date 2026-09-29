import { nodeRegistry } from "./nodeRegistry.js";

export async function runNode(
    node: any,
    input: any,
    runId?: string
) {

    const executor =
        nodeRegistry[
        node.type as keyof typeof nodeRegistry
        ];

    if (!executor) {
        throw new Error(
            `Unknown node type: ${node.type}`
        );
    }

    return await executor(
        input,
        node.config,
        runId
    );
}