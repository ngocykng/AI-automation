interface Node {
    id: string;
}

interface Connection {
    source_node_id: string;
    target_node_id: string;
}

export function topologicalSort(
    nodes: Node[],
    connections: Connection[]
): string[] {

    const graph: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    // Khởi tạo graph và inDegree
    for (const node of nodes) {
        graph[node.id] = [];
        inDegree[node.id] = 0;
    }

    // Xây dựng graph từ connections
    for (const connection of connections) {
        console.log("Connection:", connection);
        if (!graph[connection.source_node_id]) {
            throw new Error(
                `Source node ${connection.source_node_id} not found`
            );
        }

        if (!(connection.target_node_id in inDegree)) {
            console.log("Raw connection:", connection);
            console.log("Type:", typeof connection);
            throw new Error(
                `Target node ${connection.target_node_id} not found`
            );
        }

        graph[connection.source_node_id]!.push(
            connection.target_node_id
        );

        inDegree[connection.target_node_id]!++;
    }

    // Hàng đợi chứa các node không phụ thuộc ai
    const queue: string[] = [];

    for (const nodeId in inDegree) {
        if (inDegree[nodeId] === 0) {
            queue.push(nodeId);
        }
    }

    const order: string[] = [];

    while (queue.length > 0) {

        const current = queue.shift()!;// Lấy node hiện tại ra khỏi hàng đợi

        order.push(current);

        for (const next of graph[current]!) {

            inDegree[next]!--;

            if (inDegree[next] === 0) {
                queue.push(next);
            }
        }
    }

    // Kiểm tra vòng lặp (cycle)
    if (order.length !== nodes.length) {
        throw new Error(
            "Workflow contains a cycle"
        );
    }

    return order;
}