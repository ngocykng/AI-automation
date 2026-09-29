import { Router }
    from "express";

import {
    create,
    getAll,
    getGraph,
    getWorkflow,
    getworkflowRunsbyId,
    runWorkflow,
    exprtworkflowExcel
} from "../controllers/workflowController.js";
import { getWorkflowById } from "../services/workflowService.js";

const router = Router();
router.get("/", getAll);

router.post("/", create);

router.get("/:id", getWorkflow);

router.get("/:id/graph", getGraph);

router.post("/:id/run", runWorkflow);

router.get("/:id/runs", getworkflowRunsbyId);
router.get("/:id/export", exprtworkflowExcel);

export { router as workflowsRouter };