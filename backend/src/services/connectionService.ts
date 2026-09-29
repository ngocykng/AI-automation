import { v4 as uuidv4 } from 'uuid';

import {
    createConnectionQuery,
    updateConnectionQuery
} from '../queries/connectionQueries.js';

export const createConnection =
    async (data: any) => {
        return await createConnectionQuery(
            uuidv4(),
            data.workflowId,
            data.sourceNodeId,
            data.targetNodeId
        );
    }

export const updateConnection = async (
    connectionId: string,
    data: any
) => {


    return await updateConnectionQuery(connectionId, data);

};
