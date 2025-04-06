"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_js_1 = __importDefault(require("./auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./user.routes.js"));
const mainRouter = (0, express_1.Router)();
mainRouter.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});
mainRouter.use("/api/v1/auth", auth_routes_js_1.default);
mainRouter.use("/api/users", user_routes_js_1.default);
exports.default = mainRouter;
