import { v4 as uuidv4 } from "uuid";

import {
    createNodeRunQuery
} from "../queries/nodeRunQueries.js";

export const createNodeRun = async (
    runId: string,
    nodeId: string,
    output: any,
    status: string
) => {

    return await createNodeRunQuery(
        uuidv4(),
        runId,
        nodeId,
        output,
        status
    );
};