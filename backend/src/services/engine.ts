import { topologicalSort } from "./topologicalSort.js";
import { runNode } from "./runnode.js";
import { createNodeRun } from "./nodeRunService.js";
import { createWorkflowRun } from "./workflowService.js";
export interface ExecutionContext {
  outputs: Record<string, any>;

  logs: {
    nodeId: string;
    status: string;
    error?: string;
  }[];
}

export async function executeWorkflow(
  workflowId: string,
  workflowInput: any,
  nodes: any[],
  connections: any[]
) {
  // Tạo workflow run TRƯỚC khi execute để node excel có runId hợp lệ
  const run = await createWorkflowRun(workflowId);
  const runId: string = run.id;

  console.log("Connections type:", typeof connections);
  console.log("Connections:", connections);
  console.log("Is Array:", Array.isArray(connections));
  const context: ExecutionContext = {
    outputs: {},
    logs: []
  };

  const order = topologicalSort(
    nodes,
    connections
  );

  const results: {
    nodeId: string;
    output: any;
  }[] = [];

  for (const nodeId of order) {

    const node = nodes.find(
      n => n.id === nodeId
    );

    if (!node) continue;

    const parents = connections.filter(
      c => c.target_node_id === nodeId
    );

    let input: any;

    // Node bắt đầu
    if (parents.length === 0) {

      input = workflowInput;

    }
    // 1 node cha
    else if (parents.length === 1) {

      input =
        context.outputs[
        parents[0].source_node_id
        ];

    }
    // Nhiều node cha
    else {

      input = parents.map(
        p =>
          context.outputs[
          p.source_node_id
          ]
      );

    }

    let output: any;

    try {

      output = await runNode(
        node,
        input,
        runId
      );
      await createNodeRun(
        runId,
        node.id,
        output,
        "success"
      );


      context.outputs[nodeId] =
        output;

      context.logs.push({
        nodeId,
        status: "success"
      });

    } catch (error: any) {

      context.logs.push({
        nodeId,
        status: "failed",
        error: error.message
      });

      throw error;
    }

    results.push({
      nodeId,
      output
    });
  }

  return {
    results,
    logs: context.logs,
    outputs: context.outputs
  };
}