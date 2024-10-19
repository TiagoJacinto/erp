import { type Promisable } from 'type-fest';

export type NextFunction = (...args: unknown[]) => Promisable<void>;

export type MiddlewareContext = {
  req: unknown;
  res: unknown;
};

export abstract class Middleware<
  const in out TContext extends MiddlewareContext,
  const in out TNextFunction extends NextFunction,
> {
  protected abstract executeImpl(ctx: TContext, next: TNextFunction): Promise<void>;
  protected abstract handleError(error: unknown): never;

  async execute(ctx: TContext, next: TNextFunction): Promise<void> {
    try {
      await this.executeImpl(ctx, next);
    } catch (err) {
      this.handleError(err);
    }

    await next();
  }
}
