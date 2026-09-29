import { Router } from "express";

import {
    create,
    remove,
    update,
    getByWorkflow,
    getById
} from "../controllers/nodeController.js";

const router = Router();

router.post("/", create);
router.delete("/:id", remove);
router.put("/:id", update);
router.get("/workflow/:workflowId", getByWorkflow);
router.get("/:id", getById);
export { router as nodesRouter };