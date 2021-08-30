"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@7speck/logger");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const socket_1 = require("./socket");
const https = require('https');
const http = require('http');
const fs = require('fs');
require('dotenv').config();
try {
    // DEMO only, store ouside project!!
    const key = fs.readFileSync(String(__dirname + '/keys/selfsigned.key'));
    const cert = fs.readFileSync(String(__dirname + '/keys/selfsigned.crt'));
    const options = {
        key: key,
        cert: cert,
    };
    const app = express_1.default();
    /**
     * Middlewares
     */
    app.use(morgan_1.default('tiny'));
    app.use(cors_1.default());
    /**
     * Health check/ping
     */
    app.get('/health', (req, res) => {
        res.json({ started: true });
    });
    /**
     * start secure server for sockets
     */
    const server_s = https.createServer(options, app);
    const port_s = process.env.PORT_S || 443;
    const host = String(process.env.HOST) || '0.0.0.0';
    server_s.listen(port_s, host, () => {
        logger_1.logger.imp(`HTTPS Server started on ${process.env.PORT_S}`);
    });
    /**
     * Start http server for demo only !!
     * PORT 80 for vps
     */
    const port = process.env.PORT || 80;
    // TODO: disable http
    const server = http.createServer({}, app);
    server.listen(port, host, () => {
        logger_1.logger.info(`HTTP Server started on ${port}`);
    });
    // Connect to both http and https because for demo!!
    // TODO: disable http
    socket_1.initializeSocket(server_s);
    socket_1.initializeSocket(server);
}
catch (error) {
    logger_1.logger.error(error.message);
}
