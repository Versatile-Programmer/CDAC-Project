import {Router} from "express";
import { assignmentSchemaValidation } from "../middleware/schemaValidation";
import { assignmentController } from "../controllers/assigmentController.controller";
const router = Router();

// router.post("/",authMiddleware,assignmentSchemaValidation,assignmentController);

export default router;