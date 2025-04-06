"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateUserParams_middleware_js_1 = require("../middleware/validateUserParams.middleware.js");
const userController_controller_js_1 = require("../controllers/userController.controller.js");
const validateRequest_js_1 = require("../middleware/validateRequest.js");
const router = (0, express_1.Router)();
// GET /api/users/details/:role/:empNo
// Input: role (e.g., 'drm', 'hod'), empNo (employee number)
router.get("/details/:role/:empNo", 
// authenticateToken, // Apply authentication
validateUserParams_middleware_js_1.validateUserParams, validateRequest_js_1.validateRequest, userController_controller_js_1.getUserDetailsByRole);
// --- API Type 2: Get List of All Users within a Role ---
// GET /api/users/list/:role
// Input: role (e.g., 'drm', 'hod')
router.get("/list/:role", 
// authenticateToken, // Apply authentication
validateUserParams_middleware_js_1.validateUserRole, validateRequest_js_1.validateRequest, userController_controller_js_1.getUserListByRole);
exports.default = router;
