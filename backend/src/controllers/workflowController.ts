import { type Request, type Response } from "express";

import {
    createWorkflow,
    getWorkflowById,
    getWorkflowGraph,
    getWorkflows,
} from "../services/workflowService.js";
import { executeWorkflow } from "../services/engine.js";
import { getNodesByWorkflow } from "../services/nodeService.js";
import { getStartNode } from "../services/workflowService.js";
import { getworkflowRun } from "../queries/workflowQueries.js";
import pool from "../database/connection.js";
import ExelJS from "exceljs";
import console from "node:console";
import { getNodeRunsByRunId } from "../queries/nodeRunQueries.js";
export const create = async (
    req: Request,
    res: Response
) => {

    try {

        console.log(req.body);

        const {
            name,
            description
        } = req.body;

        const workflow =
            await createWorkflow(
                name,
                description
            );

        res.status(201).json(workflow);

    } catch (error: any) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};
export const getAll = async (
    req: Request,
    res: Response
) => {

    try {

        const workflows =
            await getWorkflows();

        res.json(workflows);

    } catch (error: any) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};
export const getGraph = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                message: "Invalid workflow ID"
            });
        }

        const graph = await getWorkflowGraph(id);

        res.json(graph);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
}
export const runWorkflow = async (
    req: Request,
    res: Response
) => {

    try {

        const { id } = req.params;
        const { input } = req.body;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                message: "Invalid workflow ID"
            });
        }

        const workflow =
            await getWorkflowGraph(id);

        const result =
            await executeWorkflow(
                id,
                input,
                workflow.nodes,
                workflow.connections
            );

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Error occurred while running workflow"
        });
    }
};
export const getWorkflow = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                message: "Invalid workflow ID"
            });
        }
        const workflow = await getWorkflowById(id);
        res.json({ workflow });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
export const getRun = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;

    const result = await pool.query(
        `
        SELECT *
        FROM workflow_runs
        WHERE workflow_id = $1
        ORDER BY created_at DESC
        `
        , [id]
    )
    res.json(result.rows);
}
export const getworkflowRunsbyId = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
        return res.status(400).json({
            message: "Invalid workflow ID"
        });
    }
    const runs = await getworkflowRun(id);
    res.json(runs);
}
export const exprtworkflowExcel = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
        return res.status(400).json({
            message: "Invalid workflow ID"
        });
    }

    const runs = await getworkflowRun(id);

    if (!runs.length) {
        return res.status(404).json({
            message: "No workflow runs found"
        });
    }

    const lastRun = runs[0];

    const nodeRuns =
        await getNodeRunsByRunId(
            lastRun.id
        );

    const workbook =
        new ExelJS.Workbook();

    const sheet =
        workbook.addWorksheet(
            "Results"
        );

    sheet.columns = [
        {
            header: "Node ID",
            key: "nodeId",
            width: 40
        },
        {
            header: "Status",
            key: "status",
            width: 20
        },
        {
            header: "Output",
            key: "output",
            width: 80
        }
    ];

    nodeRuns.forEach((row: any) => {

        sheet.addRow({
            nodeId: row.node_id,
            status: row.status,
            output:
                typeof row.output === "object"
                    ? JSON.stringify(row.output)
                    : row.output
        });

    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=workflow_${id}_results.xlsx`
    );

    await workbook.xlsx.write(res);

    res.end();
};