import pool from "../database/connection.js";

export const createWorkflowQuery = async (
  id: string,
  name: string,
  description: string
) => {

  const query = `
    INSERT INTO workflows(
      id,
      name,
      description
    )
    VALUES($1, $2, $3)
    RETURNING *
  `;

  const values = [
    id,
    name,
    description
  ];

  const result =
    await pool.query(query, values);

  return result.rows[0];
};
export const getWorkflowsQuery =
  async () => {

    const query = `
      SELECT *
      FROM workflows
      ORDER BY created_at DESC
    `;

    const result =
      await pool.query(query);

    return result.rows;

  };
export const getWorkflowGraphQuery = async (workflowId: string) => {
  const workflowQuery = `
    SELECT * FROM workflows
    WHERE id = $1
  `;
  const workflowResult = await pool.query(workflowQuery, [workflowId]);

  const nodesQuery = `
    SELECT * FROM nodes
    WHERE workflow_id = $1
  `;
  const nodesResult = await pool.query(nodesQuery, [workflowId]);

  const connectionsQuery = `
    SELECT * FROM connections
    WHERE workflow_id = $1
  `;
  const connectionsResult = await pool.query(connectionsQuery, [workflowId]);

  return {
    workflow: workflowResult.rows[0],
    nodes: nodesResult.rows,
    connections: connectionsResult.rows
  };
};
export const connectNodes = async (
  sourceId: string,
  targetId: string
) => {
  const query = `
    UPDATE nodes
    SET next_node_id = $1
    WHERE id = $2
  `;
  await pool.query(query, [targetId, sourceId]);
};
export const getWorkflowByIdQuery = async (id: string) => {
  const query = `
    SELECT *
    FROM workflows
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0]; // chỉ trả object
};
import { v4 as uuidv4 } from "uuid";

export const workflowRun = async (
  workflowId: string,
  status: string
) => {

  const query = `
    INSERT INTO workflow_runs(
        id,
        workflow_id,
        status,
        started_at
    )
    VALUES(
        $1,
        $2,
        $3,
        NOW()
    )
    RETURNING *
    `;

  const values = [
    uuidv4(),
    workflowId,
    status
  ];

  const result =
    await pool.query(query, values);

  return result.rows[0];
};
export const getworkflowRun = async (
  workflowId: string
) => {
  const query =
    `
    SELECT *
    FROM workflow_runs
    Where workflow_id = $1
    ORDER BY started_at DESC
  `;
  const result = await pool.query(
    query,
    [workflowId]
  );
  return result.rows;
}
export const createWorkflowRunQuery = async (
  id: string,
  workflowId: string
) => {

  const query = `
        INSERT INTO workflow_runs(
            id,
            workflow_id,
            status
        )
        VALUES($1,$2,'running')
        RETURNING *
    `;

  const result =
    await pool.query(
      query,
      [id, workflowId]
    );

  return result.rows[0];
};
export const finishWorkflowRunQuery =
  async (
    runId: string,
    status: string
  ) => {

    const query = `
        UPDATE workflow_runs
        SET
            status = $2,
            finished_at = NOW()
        WHERE id = $1
        RETURNING *
    `;

    const result =
      await pool.query(
        query,
        [runId, status]
      );

    return result.rows[0];
  };