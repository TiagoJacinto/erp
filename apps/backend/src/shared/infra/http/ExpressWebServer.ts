import cors from 'cors';
import express, { type Router } from 'express';
import { type Server } from 'http';

import { logger } from '../logging';
import { errorMorgan, infoMorgan } from '../logging/morgan';
import { ProcessService } from '../processes/ProcessService';
import { WebServer } from './WebServer';

type WebServerConfig = {
  port: number;
  prefix?: string;
  router: Router;
};

export class ExpressWebServer extends WebServer {
  private readonly express: express.Express;
  private readonly config: WebServerConfig;

  protected server?: Server;

  constructor(config: WebServerConfig) {
    super();
    this.config = config;
    this.express = express();
    this.configure();
    this.configureSignals();
  }

  protected configure(): void {
    this.express.use(cors());
    this.express.use(express.json());

    this.express.use(errorMorgan);
    this.express.use(infoMorgan);

    this.express.use(this.config.prefix || '', this.config.router);
  }

  private configureSignals() {
    process.on('SIGTERM', () => this.stop());
    process.on('SIGINT', () => this.stop());
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      ProcessService.killProcessOnPort(this.config.port, () => {
        this.server = this.express.listen(this.config.port, () => {
          logger.info(`Server is running on port ${this.config.port}`);
          resolve();
        });
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) return reject('Server is not running');

      this.server.close((err) => {
        if (err) return reject('Error stopping the server');
        return resolve();
      });
    });
  }
}
