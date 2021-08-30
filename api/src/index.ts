import { logger } from '@7speck/logger';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { initializeSocket } from './socket';

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

  const app = express();
  /**
   * Middlewares
   */
  app.use(morgan('tiny'));
  app.use(cors());

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
    logger.imp(`HTTPS Server started on ${process.env.PORT_S}`);
  });

  /**
   * Start http server for demo only !!
   * PORT 80 for vps
   */
  const port = process.env.PORT || 80;

  // TODO: disable http
  const server = http.createServer({}, app);
  server.listen(port, host, () => {
    logger.info(`HTTP Server started on ${port}`);
  });

  // Connect to both http and https because for demo!!
  // TODO: disable http
  initializeSocket(server_s);
  initializeSocket(server);
} catch (error) {
  logger.error('Error occured');
  console.error(error);
}
