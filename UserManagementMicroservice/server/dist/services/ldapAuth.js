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
exports.authenticateUser = void 0;
const ldapjs_1 = __importDefault(require("ldapjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const LDAP_URL = process.env.LDAP_URL || "ldap://localhost:389";
const BIND_DN = process.env.LDAP_BIND_DN || "";
const BIND_PASSWORD = process.env.LDAP_BIND_PASSWORD || "";
const BASE_DN = process.env.LDAP_BASE_DN || "";
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const client = ldapjs_1.default.createClient({ url: LDAP_URL });
        // Bind as admin to search for the user
        client.bind(BIND_DN, BIND_PASSWORD, (err) => {
            if (err) {
                return reject(new Error("Admin Bind Failed"));
            }
            // Search for user by email
            const opts = {
                filter: `(mail=${email})`,
                scope: "sub",
                attributes: ["dn", "employeeNumber", "cn", "mail", "gidNumber"],
            };
            client.search(BASE_DN, opts, (err, res) => {
                if (err) {
                    client.unbind();
                    return reject(new Error("LDAP Search Error"));
                }
                let userDn;
                let employeeNumber = null;
                let employeeName = null;
                let employeeEmail = null;
                let employeeCenter = null;
                let gidNumber = null;
                res.on("searchEntry", (entry) => {
                    var _a, _b, _c, _d;
                    const user = entry;
                    // userDn = entry.toObject();
                    // console.log(userDn)
                    employeeNumber =
                        ((_a = user.attributes.find((attr) => attr.type === "employeeNumber")) === null || _a === void 0 ? void 0 : _a.values[0]) || null;
                    console.log(employeeNumber);
                    employeeName =
                        ((_b = user.attributes.find((attr) => attr.type === "cn")) === null || _b === void 0 ? void 0 : _b.values[0]) ||
                            null;
                    console.log(employeeName);
                    employeeEmail =
                        ((_c = user.attributes.find((attr) => attr.type === "mail")) === null || _c === void 0 ? void 0 : _c.values[0]) ||
                            null;
                    console.log(employeeEmail);
                    gidNumber =
                        ((_d = user.attributes.find((attr) => attr.type === "gidNumber")) === null || _d === void 0 ? void 0 : _d.values[0]) || null;
                    console.log(gidNumber);
                });
                res.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
                    if (!employeeEmail) {
                        client.unbind();
                        return reject(new Error("User not found"));
                    }
                    // Bind as user to verify password
                    // client.bind(userDn, password, async (err:Error | null) => {
                    //   if (err) {
                    //     client.unbind();
                    //     return reject(new Error("Invalid Credentials"));
                    //   }
                    // Fetch employee center name from gidNumber
                    if (gidNumber) {
                        employeeCenter = yield getCenterName(client, gidNumber);
                        console.log(employeeCenter);
                    }
                    client.unbind();
                    resolve({
                        employeeNumber,
                        employeeName,
                        employeeEmail,
                        employeeCenter,
                    });
                }));
            });
        });
    });
});
exports.authenticateUser = authenticateUser;
const getCenterName = (client, gidNumber) => {
    return new Promise((resolve, reject) => {
        const opts = {
            filter: `(gidNumber=${gidNumber})`,
            scope: "sub",
            attributes: ["cn"],
        };
        client.search(`ou=Centers,${BASE_DN}`, opts, (err, res) => {
            if (err) {
                return reject(new Error("LDAP Center Search Error"));
            }
            let centerName = null;
            res.on("searchEntry", (entry) => {
                var _a;
                const user = entry;
                centerName =
                    ((_a = user.attributes.find((attr) => attr.type === "cn")) === null || _a === void 0 ? void 0 : _a.values[0]) || null;
                console.log(centerName);
            });
            res.on("end", () => {
                resolve(centerName);
            });
        });
    });
};
