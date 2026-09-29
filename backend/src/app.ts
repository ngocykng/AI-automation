import express from "express";
import cors from "cors";

import { workflowsRouter } from "./routers/workflows.js";
import { nodesRouter } from "./routers/nodes.js";
import { connectionsRouter } from "./routers/connections.js";
import { authRouter } from "./routers/auth.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

// Auth endpoints (public — these issue the JWT).
app.use("/api/auth", authRouter);

// Protected endpoints — authMiddleware runs before any route inside the router.
app.use("/api/workflows", authMiddleware, workflowsRouter);
app.use("/api/nodes", authMiddleware, nodesRouter);
app.use("/api/connections", authMiddleware, connectionsRouter);

export { app };