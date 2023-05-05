import { getClientIp } from 'request-ip';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RemoteIpAddress = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return getClientIp(context.switchToHttp().getRequest());
  },
);
