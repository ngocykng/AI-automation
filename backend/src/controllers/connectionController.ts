import { type Request, type Response } from 'express';

import {
    createConnection,
    updateConnection
} from '../services/connectionService.js';
import { connectNodes } from "../services/workflowService.js";
export const create = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            workflowId,
            sourceNodeId,
            targetNodeId,
        } = req.body;

        const connection =
            await createConnection({
                workflowId,
                sourceNodeId,
                targetNodeId
            });

        await connectNodes(
            sourceNodeId,
            targetNodeId
        );
        res.status(201).json(connection);

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

        if (!req.params.id || typeof req.params.id !== "string") {
            return res.status(400).json({
                message: "Connection ID is required"
            });
        }

        const connection =
            await updateConnection(
                req.params.id,
                req.body
            );
        res.json(connection);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
}