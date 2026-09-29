import pool from "../database/connection.js";
import { validate as isUUID } from "uuid";
export const createNodeRunQuery = async (
    id: string,
    runId: string,
    nodeId: string,
    output: any,
    status: string
) => {

    const query = `
        INSERT INTO node_runs(
            id,
            run_id,
            node_id,
            output,
            status
        )
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
    `;

    const values = [
        id,
        runId,
        nodeId,
        JSON.stringify(output),
        status
    ];

    const result =
        await pool.query(query, values);

    return result.rows[0];
};
export const getNodeRunsByRunId = async (runId: string) => {
    if (!runId || !isUUID(runId)) {
        throw new Error("Invalid runId (must be UUID)");
    }

    const result = await pool.query(
        `
        SELECT *
        FROM node_runs
        WHERE run_id = $1
        ORDER BY created_at ASC
        `,
        [runId]
    );

    return result.rows;
};