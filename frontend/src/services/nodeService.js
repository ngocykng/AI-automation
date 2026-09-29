import api from "./api";


export const getNode = (id) => {
    return api.get(`/nodes/${id}`);
};
export const createNode = (data) => {
    return api.post("/nodes", data);
}
export const updateNode = (id, data) => {
    return api.put(`/nodes/${id}`, data);
};
export const deleteNode = (id) => {
    return api.delete(`/nodes/${id}`);
}