import { logger } from '@7speck/logger';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { initializeSocket } from './socket';

const https = require('https');
const http = require('http');
const fs = require('fs');

require('dotenv').config();

const key = fs.readFileSync(String(__dirname + '/keys/selfsigned.key'));
const cert = fs.readFileSync(String(__dirname + '//keys/selfsigned.crt'));

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

const server_s = https.createServer(options, app);
const server = http.createServer(options, app);

server_s.listen(Number(process.env.PORT_S), String(process.env.HOST), () => {
  logger.imp(`HTTPS Server started on ${process.env.PORT_S}`);
});

server.listen(Number(process.env.PORT), String(process.env.HOST), () => {
  logger.info(`HTTP Server started on ${process.env.PORT}`);
});

try {
  initializeSocket(server_s);
  initializeSocket(server);
} catch (error) {
  console.log('soc err:', error);
}
