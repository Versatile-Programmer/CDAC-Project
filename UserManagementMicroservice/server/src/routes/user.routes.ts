import {Router} from "express";
import { validateUserParams, validateUserRole } from "../middleware/validateUserParams.middleware.js";
import { getUserDetailsByRole,getUserListByRole,getCentreList, getGroupList } from "../controllers/userController.controller.js";

const router = Router();

// GET /api/users/details/:role/:empNo
// Input: role (e.g., 'drm', 'hod'), empNo (employee number)
router.get(
  "/details/:role/:empNo",
  // authenticateToken, // Apply authentication
  validateUserParams,
  getUserDetailsByRole
);


// --- API Type 2: Get List of All Users within a Role ---
// GET /api/users/list/:role
// Input: role (e.g., 'drm', 'hod')
router.get(
  "/list/:role",
  // authenticateToken, // Apply authentication
 validateUserRole,
  getUserListByRole
);


// GET /api/users/centre/:centreid
router.get("/centre/:centreid",  getCentreList);

// GET /api/users/group/:groupid
router.get("/group/:groupid",  getGroupList);


export default router;

