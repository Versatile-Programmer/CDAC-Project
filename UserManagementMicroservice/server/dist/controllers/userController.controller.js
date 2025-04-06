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
exports.getUserListByRole = exports.getUserDetailsByRole = void 0;
const database_config_js_1 = __importDefault(require("../config/database.config.js"));
// import * as ldapService from "../services/ldapService";
const client_1 = require("@prisma/client"); // Import the enum
// --- Helper Function to Map Role String to Prisma Model/Enum ---
const getRoleInfo = (roleString) => {
    switch (roleString.toLowerCase()) {
        case "drm":
            return {
                model: database_config_js_1.default.drmList,
                enumValue: client_1.Role.DRM,
                includeUser: true,
                includeCentre: true,
                includeGroup: true,
            };
        case "arm":
            return {
                model: database_config_js_1.default.armList,
                enumValue: client_1.Role.ARM,
                includeUser: true,
                includeCentre: true,
                includeGroup: true,
            };
        case "hod":
            return {
                model: database_config_js_1.default.hodList,
                enumValue: client_1.Role.HOD,
                includeUser: true,
                includeCentre: true,
                includeGroup: true,
            };
        case "ed":
            return {
                model: database_config_js_1.default.edCentreHead,
                enumValue: client_1.Role.ED,
                includeUser: true,
                includeCentre: true,
                includeGroup: false,
            }; // ED not directly linked to GroupDept in schema
        case "webmaster":
            return {
                model: database_config_js_1.default.webMaster,
                enumValue: client_1.Role.WEBMASTER,
                includeUser: true,
                includeCentre: true,
                includeGroup: false,
            }; // Webmaster not linked to GroupDept
        case "netops":
            return {
                model: database_config_js_1.default.memberNetops,
                enumValue: client_1.Role.NETOPS,
                includeUser: true,
                includeCentre: true,
                includeGroup: false,
            }; // NetOps not linked to GroupDept
        case "hod_hpc":
            return {
                model: database_config_js_1.default.hodHpcIandE,
                enumValue: client_1.Role.HODHPC,
                includeUser: true,
                includeCentre: false,
                includeGroup: false,
            }; // HodHpc not linked to Centre/Group
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
        // Construct include object based on roleInfo flags
        const includes = {};
        if (roleInfo.includeUser)
            includes.user = {
                select: {
                    emp_no: true,
                    usr_email: true,
                    usr_fname: true,
                    usr_lname: true,
                    is_active: true,
                }, // Select specific user fields
            };
        if (roleInfo.includeCentre)
            includes.centre = { select: { centre_id: true, cn_name: true } }; // Select specific centre fields
        if (roleInfo.includeGroup)
            includes.group = { select: { dept_id: true, d_name: true } }; // Select specific group fields
        // Query the specific role table (e.g., prisma.drmList, prisma.hodList)
        // The type assertion `as any` is sometimes needed because Prisma's model types vary
        const userDetails = yield roleInfo.model.findUnique({
            where: { emp_no: empNoBigInt }, // Find by employee number (which is the PK/FK)
            include: includes,
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
        // Construct include object
        const includes = {};
        if (roleInfo.includeUser)
            includes.user = {
                select: {
                    emp_no: true,
                    usr_email: true,
                    usr_fname: true,
                    usr_lname: true,
                    is_active: true,
                },
            };
        if (roleInfo.includeCentre)
            includes.centre = { select: { centre_id: true, cn_name: true } };
        if (roleInfo.includeGroup)
            includes.group = { select: { dept_id: true, d_name: true } };
        // Query the specific role table for all active users
        const userList = yield roleInfo.model.findMany({
            where: {
                is_active: true, // Filter by the active flag on the role table itself
                // Optionally filter by user.is_active if you included it and want both checks
                // user: {
                //     is_active: true
                // }
            },
            include: includes,
            orderBy: {
                // Optional: Add default sorting
                user: { usr_fname: "asc" }, // Sort by last name if user is included
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
