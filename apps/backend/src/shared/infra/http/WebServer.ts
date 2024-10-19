import { type Server } from 'http';

export abstract class WebServer {
  protected abstract server?: Server;

  protected abstract configure(): void;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;

  getHttp() {
    if (!this.server) throw new Error('Server not started');
    return this.server;
  }

  isStarted() {
    return !!this.server;
  }
}
