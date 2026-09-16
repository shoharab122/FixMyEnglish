import http from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { log } from './lib/logger.js';
import { attachSocketGateway } from './sockets/gateway.js';

const app = createApp();
const server = http.createServer(app);
attachSocketGateway(server);

server.listen(env.port, () => {
  log.info(`API listening on http://localhost:${env.port}`);
});
