"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupList = exports.getCentreList = exports.getUserListByRole = exports.getUserDetailsByRole = void 0;
const database_config_js_1 = __importDefault(require("../config/database.config.js"));
// --- Helper Function to Map Role String to Prisma Model/Enum ---
const getRoleInfo = (roleString) => {
    switch (roleString.toLowerCase()) {
        case "drm":
            return database_config_js_1.default.drm;
        case "arm":
            return database_config_js_1.default.arm;
        case "hod":
            return database_config_js_1.default.hod;
        case "ed":
            return database_config_js_1.default.edCentreHead; // ED not directly linked to GroupDept in schema
        case "webmaster":
            return database_config_js_1.default.webMaster; // Webmaster not linked to GroupDept
        case "netops":
            return database_config_js_1.default.memberNetops;
        // NetOps not linked to GroupDept
        case "hod_hpc":
            return database_config_js_1.default.hodHpcIandE; // HodHpc not linked to Centre/Group
        default:
            return null;
    }
};
// --- Helper Function to Serialize BigInts in Response ---
// JSON.stringify doesn't handle BigInt, so we convert them to strings.
const stringifyBigInts = (obj) => {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(stringifyBigInts);
    }
    const newObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (typeof value === "bigint") {
                newObj[key] = value.toString();
            }
            else if (typeof value === "object") {
                newObj[key] = stringifyBigInts(value); // Recursively process nested objects/arrays
            }
            else {
                newObj[key] = value;
            }
        }
    }
    return newObj;
};
/**
 * GET /api/users/details/:role/:empNo
 * Fetches full details for a specific user from their corresponding role table.
 */
const getUserDetailsByRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, empNo } = req.params;
    const empNoBigInt = BigInt(empNo); // Convert param string to BigInt
    try {
        const roleInfo = getRoleInfo(role);
        if (!roleInfo) {
            // This check is technically redundant due to express-validator, but good practice
            res.status(400).json({ message: "Invalid role specified." });
            return;
        }
        // Query the specific role table (e.g., prisma.drmList, prisma.hodList)
        // The type assertion `as any` is sometimes needed because Prisma's model types vary
        const userDetails = yield roleInfo.findUnique({
            where: { emp_no: empNoBigInt }, // Find by employee number (which is the PK/FK)
        });
        if (!userDetails) {
            res
                .status(404)
                .json({
                message: `User details not found for role '${role}' and employee number '${empNo}'.`,
            });
            return;
        }
        // Important: Check if the base user is active (if included) or if the role record has its own active flag
        if ((userDetails.user && !userDetails.user.is_active) ||
            !userDetails.is_active) {
            res
                .status(404)
                .json({
                message: `User details not found for role '${role}' and employee number '${empNo}' (user may be inactive).`,
            });
            return;
        }
        // Serialize BigInts to strings before sending
        res.status(200).json(stringifyBigInts(userDetails));
    }
    catch (error) {
        // Catch potential BigInt conversion errors or other issues
        if (error instanceof Error && error.message.includes("Cannot convert")) {
            res
                .status(400)
                .json({ message: "Invalid employee number format." });
            return;
        }
        next(error);
    }
});
exports.getUserDetailsByRole = getUserDetailsByRole;
/**
 * GET /api/users/list/:role
 * Fetches a list of all active users belonging to a specific role.
 */
const getUserListByRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.params;
    try {
        const roleInfo = getRoleInfo(role);
        if (!roleInfo) {
            res.status(400).json({ message: "Invalid role specified." });
            return;
        }
        // Query the specific role table for all active users
        const userList = yield roleInfo.findMany({
            where: {
                is_active: true, // Filter by the active flag on the role table itself
            },
            orderBy: {
                // Optional: Add default sorting
                emp_no: "asc", // Sort by last name if user is included
                // Or sort by a field on the role table directly, e.g., emp_no: 'asc'
            },
            // TODO: Add pagination later if needed (using skip, take)
        });
        // Serialize BigInts before sending
        res.status(200).json(stringifyBigInts(userList));
    }
    catch (error) {
        next(error);
    }
});
exports.getUserListByRole = getUserListByRole;
const getCentreList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { centreid } = req.params;
    try {
        const centre = yield database_config_js_1.default.centre.findUnique({
            where: {
                centre_id: parseInt(centreid),
            },
        });
        if (!centre) {
            res.status(404).json({ error: "Centre not found." });
            return;
        }
        res.status(200).json(centre);
    }
    catch (error) {
        res.status(400).send(`No centre found for centre_id ${centreid}`);
    }
});
exports.getCentreList = getCentreList;
const getGroupList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupid } = req.params;
    try {
        const group = yield database_config_js_1.default.groupDepartment.findUnique({
            where: {
                dept_id: parseInt(groupid),
            },
        });
        if (!group) {
            res.status(404).json({ error: "Centre not found." });
            return;
        }
        res.status(200).json(group);
    }
    catch (error) {
        res.status(400).send(`No centre found for centre_id ${groupid}`);
    }
});
exports.getGroupList = getGroupList;
