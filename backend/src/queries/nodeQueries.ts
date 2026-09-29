import pool from "../database/connection.js";

export const createNodeQuery =
    async (
        id: string,
        workflowId: string,
        type: string,
        label: string,
        positionX: number,
        positionY: number,
        config: any
    ) => {

        const query = `
      INSERT INTO nodes(
        id,
        workflow_id,
        type,
        label,
        position_x,
        position_y,
        config
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `;

        const values = [
            id,
            workflowId,
            type,
            label,
            positionX,
            positionY,
            config ? JSON.stringify(config) : null
        ];

        const result =
            await pool.query(
                query,
                values
            );

        return result.rows[0];

    };
export const deleteNodeQuery = async (
    nodeId: string
) => {
    const query = `
    DELETE FROM nodes
    WHERE id = $1
    RETURNING *
  `;
    const result = await pool.query(query, [nodeId]);
    return result.rows[0];
}
export const updateNodeQuery = async (
    id: string,
    data: any
) => {
    console.log("updateNodeQuery data =", data);
    console.log("id =", id);
    console.log("data =", data);
    const query = `
    UPDATE nodes
    SET 
      label = $2,
      position_x = $3,
      position_y = $4,
      config = $5
    WHERE id = $1
    RETURNING *
  `;
    const values = [
        id,
        data.label || data.data?.label,   // lấy label từ root hoặc từ data
        data.position_x || data.position?.x,
        data.position_y || data.position?.y,
        data.config ? JSON.stringify(data.config) : null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
}
export const getNodesByWorkflowQuery = async (
    workflowId: string
) => {

    const query = `
    SELECT *
    FROM nodes
    WHERE workflow_id = $1
    ORDER BY created_at ASC
  `;
    const result = await pool.query(query, [workflowId]);
    return result.rows;
}
export const getNodeByIdQuery =
    async (id: string) => {

        const result =
            await pool.query(
                `
            SELECT *
            FROM nodes
            WHERE id = $1
            `,
                [id]
            );

        return result.rows[0];

    };