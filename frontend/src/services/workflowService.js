import api from "../services/api";

export const getWorkflow = () => {
    return api.get("/workflows");
}
export const getWorkflowsGraph = (id) => {
    return api.get(`/workflows/${id}/graph`);
}
export const createWorkflow = (data) => {
    return api.post("/workflows", data);
}
