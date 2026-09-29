import { v4 as uuidv4 } from "uuid";

import { createWorkflowQuery, createWorkflowRunQuery, finishWorkflowRunQuery } from "../queries/workflowQueries.js";
import { getWorkflowsQuery } from "../queries/workflowQueries.js";

import {
    getWorkflowGraphQuery,

} from "../queries/workflowQueries.js";
import pool from "../database/connection.js";
import { getNodesByWorkflowQuery } from "../queries/nodeQueries.js";
export interface Node {
    id: string;
    type: "input" | "ai" | "output"; // hoặc mở rộng thêm các loại khác
    nextNodeId?: string;
    config?: Record<string, any>; // cấu hình riêng cho node AI
}
export const createWorkflow = async (
    name: string,
    description: string
) => {

    const workflow =
        await createWorkflowQuery(
            uuidv4(),
            name,
            description
        );

    return workflow;
};
export const getWorkflows = async () => {

    const workflows =
        await getWorkflowsQuery();

    return workflows;
};

export const getWorkflowGraph = async (workflowId: string) => {
    return await getWorkflowGraphQuery(workflowId);
};

export const connectNodes = async (
    sourceNodeId: string,
    targetNodeId: string
) => {
    console.log("Connecting nodes:", sourceNodeId, "->", targetNodeId);
    await pool.query(
        `
        UPDATE nodes
        SET next_node_id = $1
        WHERE id = $2
      `,
        [targetNodeId, sourceNodeId]
    )
};
export const getStartNode = (nodes: any[]) => {
    const startNode = nodes.find(
        node => node.type === "http"
    );

    if (!startNode) {
        throw new Error("Start node not found");
    }

    return startNode;
};


export const getWorkflowById = async (workflowId: string) => {
    const workflow = await getWorkflowGraphQuery(workflowId);

    if (!workflow) {
        throw new Error("Workflow not found");
    }

    return workflow;
};
export const createWorkflowRun = async (
    workflowId: string
) => {

    const runId = uuidv4();

    return await createWorkflowRunQuery(
        runId,
        workflowId
    );
};

export const finishWorkflowRun = async (
    runId: string,
    status: "success" | "failed"
) => {

    return await finishWorkflowRunQuery(
        runId,
        status
    );
};
