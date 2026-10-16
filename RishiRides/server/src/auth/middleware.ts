import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from '../config';

export type AuthenticatedRequest = Request & {
  auth?: { userId: string; role: 'PASSENGER' | 'DRIVER' | 'ADMIN' };
};

export function requireAuth(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const token = request.header('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication is required.' } });

  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    if (typeof payload.sub !== 'string' || !['PASSENGER', 'DRIVER', 'ADMIN'].includes(String(payload.role))) {
      return response.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'The access token is invalid.' } });
    }
    request.auth = {
      userId: payload.sub,
      role: payload.role as 'PASSENGER' | 'DRIVER' | 'ADMIN',
    };
    return next();
  } catch {
    return response.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'The access token is invalid or expired.' } });
  }
}

export function requireRole(...roles: Array<'PASSENGER' | 'DRIVER' | 'ADMIN'>) {
  return (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    if (!request.auth || !roles.includes(request.auth.role)) {
      return response.status(403).json({ error: { code: 'FORBIDDEN', message: 'You are not authorized to perform this action.' } });
    }
    return next();
  };
}