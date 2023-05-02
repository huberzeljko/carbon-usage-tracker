import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt, { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@app/shared/config';
import { JwtUser } from '../interfaces';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  sign(data: JwtUser) {
    const { secret, ...options } = this.getJwtOptions();
    return {
      token: sign(data, secret, options),
    };
  }

  verify(token: string): JwtUser {
    const { secret, ...options } = this.getJwtOptions();
    return this.validate(verify(token, secret, options) as jwt.JwtPayload);
  }

  private validate(payload: jwt.JwtPayload): JwtUser {
    if (!payload.id || !payload.name) {
      throw new UnauthorizedException('Invalid jwt payload');
    }

    return {
      id: payload.id,
      name: payload.name,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }

  private getJwtOptions() {
    const {
      jwt: { secret, durationInMinutes, issuer, audience },
    } = this.configService.get('security');

    return {
      secret: secret,
      expiresIn: durationInMinutes,
      issuer: issuer,
      audience: audience,
    };
  }
}
