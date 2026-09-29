import pool from "../database/connection.js";

export const createConnectionQuery =
    async (
        id: string,
        workflowId: string,
        sourceNodeId: string,
        targetNodeId: string
    ) => {

        const query = `
        INSERT INTO connections (
        id,
        source_node_id, 
        target_node_id, 
        workflow_id
        )
        VALUES($1, $2, $3, $4)
        RETURNING *;
    `;
        const values = [
            id,
            sourceNodeId,
            targetNodeId,
            workflowId
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
export const updateConnectionQuery = async (
    connectionId: string,
    data: any
) => {

    const query = `
        UPDATE connections
        SET
        source_node_id = $2,
        target_node_id = $3
        WHERE id = $1
        RETURNING *
        `;
    const values = [
        connectionId,
        data.sourceNodeId,
        data.targetNodeId
    ]
    const result = await pool.query(query, values);
    return result.rows[0];
}