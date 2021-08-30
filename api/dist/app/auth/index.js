"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const express_jwt_1 = __importDefault(require("express-jwt"));
const jwt_rsa_1 = __importDefault(require("jwt-rsa"));
const authService = (app) => {
    const jwtCheck = express_jwt_1.default({
        secret: jwt_rsa_1.default.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: 'https://dev-manga.us.auth0.com/.well-known/jwks.json',
        }),
        audience: 'http://localhost:3001',
        issuer: 'https://dev-manga.us.auth0.com/',
        algorithms: ['RS256'],
    });
    app.use(jwtCheck);
    app.get('/authorized', function (req, res) {
        res.send('Secured Resource');
    });
};
exports.authService = authService;
