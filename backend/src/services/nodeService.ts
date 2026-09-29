import { v4 as uuidv4 } from "uuid";

import {
    createNodeQuery,
    deleteNodeQuery,
    updateNodeQuery,
    getNodesByWorkflowQuery,
    getNodeByIdQuery,
} from "../queries/nodeQueries.js";
import { config } from "googleapis/build/src/apis/config/index.js";


export const createNode = async (
    workflowId: string,
    type: string,
    label: string,
    position_x: number,
    position_y: number,
    config: any
) => {

    return await createNodeQuery(
        uuidv4(),
        workflowId,
        type,
        label,
        position_x,
        position_y,
        config
    );

};

export const deleteNode = async (
    id: string
) => {
    return await deleteNodeQuery(
        id
    );

}
export const updateNode = async (id: string, data: any) => {
    const row = await updateNodeQuery(id, data);

    const config = typeof row.config === "string"
        ? JSON.parse(row.config)
        : row.config || {};

    return {
        id: row.id,
        position: { x: row.position_x, y: row.position_y },
        data: { label: row.label, type: row.type },
        config
    };
};


export const DeleteNode = async (
    id: string
) => {
    return await deleteNodeQuery(id);
};
export const getNodesByWorkflow = async (
    workflowId: string
) => {
    return await getNodesByWorkflowQuery(workflowId);
};

export const getNodeById =
    async (id: string) => {

        return await getNodeByIdQuery(id);

    };
