import { type FastifyRequest } from 'fastify';

import { Middleware } from '../Middleware';

export type FastifyMiddlewareContext = {
  req: FastifyRequest;
  res: unknown;
};

export abstract class FastifyMiddleware extends Middleware<FastifyMiddlewareContext, () => void> {
  protected handleError(error: unknown): never {
    throw error;
  }
}
