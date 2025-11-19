"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
// This is a lightweight example test. In reality you'd mock the DB.
(0, vitest_1.describe)('GET /api/products', () => {
    (0, vitest_1.it)('should return 400 when query params are invalid', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/products?limit=-1');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
});
