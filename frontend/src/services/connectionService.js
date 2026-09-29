import api from "./api";

export const createConnection = (data) =>
    api.post(
        "/connections",
        data
    );