import { type Request, type Response } from "express";

import {
    createNode,
    deleteNode,
    updateNode,
    getNodesByWorkflow,
    getNodeById
} from "../services/nodeService.js";

export const create = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            workflowId,
            type,
            label,
            position_x,
            position_y,
            config
        } = req.body;

        const node =
            await createNode(
                workflowId,
                type,
                label,
                position_x,
                position_y,
                config
            );

        res.status(201).json(node);

    } catch (error: any) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};
export const remove = async (
    req: Request,
    res: Response
) => {
    try {

        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).json({
                message: "Node ID is required"
            });
        }
        const node =
            await deleteNode(
                req.params.id
            );

        res.json(node);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
}
export const update = async (
    req: Request,
    res: Response
) => {
    try {
        console.log("Node update body:", req.body);

        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).json({
                message: "Node ID is required"
            });
        }
        const { id } =
            req.params;
        const node =
            await updateNode(
                id,
                req.body
            );
        res.json(node);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
}
export const DELETE = async (
    req: Request,
    res: Response
) => {
    try {

        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).json({
                message: "Node ID is required"
            });
        }
        const node =
            await deleteNode(
                req.params.id
            );
        res.json(node);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
}
export const getByWorkflow = async (
    req: Request,
    res: Response
) => {
    try {

        if (!req.params.workflowId || typeof req.params.workflowId !== "string") {
            return res.status(400).json({
                message: "Workflow ID is required"
            });
        }
        const node =
            await getNodesByWorkflow(
                req.params.workflowId
            );
        res.json(node);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
}
export const getById = async (
    req: Request,
    res: Response
) => {

    try {
        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).json({
                message: "Node ID is required"
            });
        }

        const node =
            await getNodeById(
                req.params.id
            );

        res.json(node);

    } catch (error: any) {

        res.status(500).json({
            message: error.message
        });

    }

};