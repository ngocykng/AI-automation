import { Router } from "express";
import {
    create,
    update
} from "../controllers/connectionController.js";

const router = Router();

router.post("/", create);
router.put("/:id", update);
export { router as connectionsRouter };