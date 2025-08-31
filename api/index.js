const { createServer } = require('http');
const { parse } = require('url');
const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

// Import compiled app module
const { AppModule } = require('../dist/app.module');

let cachedServer;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    
    const app = await NestFactory.create(AppModule, adapter, {
      logger: ['error', 'warn'],
    });
    
    app.enableCors();
    await app.init();
    
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

module.exports = async (req, res) => {
  const server = await bootstrapServer();
  server.emit('request', req, res);
};
