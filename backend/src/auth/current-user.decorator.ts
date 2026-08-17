import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Custom parameter decorator. Lets us write:
//   someRoute(@CurrentUserId() userId: string) { ... }
// instead of manually digging into the request object every time.
export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as any).userId;
  },
);