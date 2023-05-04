import { Request } from 'express';
import { extractBearerToken } from './extract-bearer-token';

describe('extractBearerToken', () => {
  it('should return undefined when the authorization header is missing', () => {
    const request: Partial<Request> = {
      headers: {},
    };

    const result = extractBearerToken(request as Request);
    expect(result).toBeUndefined();
  });

  it('should return undefined when the authorization header has an invalid type', () => {
    const request: Partial<Request> = {
      headers: {
        authorization: 'InvalidType token123',
      },
    };

    const result = extractBearerToken(request as Request);
    expect(result).toBeUndefined();
  });

  it('should return undefined when the authorization header has no token', () => {
    const request: Partial<Request> = {
      headers: {
        authorization: 'Bearer',
      },
    };

    const result = extractBearerToken(request as Request);
    expect(result).toBeUndefined();
  });

  it('should return the token when the authorization header has a valid Bearer token', () => {
    const token = 'token123';
    const request: Partial<Request> = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const result = extractBearerToken(request as Request);
    expect(result).toEqual(token);
  });
});
