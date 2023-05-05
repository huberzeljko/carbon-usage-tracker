import { Injectable } from '@nestjs/common';
import { createHmac, randomBytes } from 'crypto';
import { Duration, Instant } from '@js-joda/core';
import { ConfigService } from '@app/shared/config';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '@app/domain/entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/domain';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  async addRefreshToken(
    user: UserEntity,
    ipAddress?: string,
  ): Promise<{ entity: RefreshTokenEntity; clearTextRefreshToken: string }> {
    const { clearTextToken, hashedToken, expiresAt } =
      this.generateRefreshToken();

    const entity = this.refreshTokenRepository.create({
      token: hashedToken,
      user: { id: user.id },
      remoteIpAddress: ipAddress,
      expires: expiresAt,
    });

    const refreshTokenEntity = await this.refreshTokenRepository.save(entity);

    return {
      entity: refreshTokenEntity,
      clearTextRefreshToken: clearTextToken,
    };
  }

  generateRefreshToken(): {
    clearTextToken: string;
    hashedToken: string;
    expiresAt: Instant;
  } {
    const clearTextToken = randomBytes(64).toString('hex');
    const hashedToken = this.hashRefreshToken(clearTextToken);

    const durationInMinutes = this.configService.get(
      'security.refreshToken.durationInMinutes',
    );
    const expiresAt = Instant.now().plus(Duration.ofMinutes(durationInMinutes));

    return { clearTextToken, hashedToken, expiresAt };
  }

  hashRefreshToken(clearTextToken: string): string {
    const secret = this.configService.get('security.refreshToken.secret');
    return createHmac('sha256', secret).update(clearTextToken).digest('base64');
  }

  removeRefreshToken(refreshToken: RefreshTokenEntity) {
    return this.refreshTokenRepository.remove(refreshToken);
  }

  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenEntity | null> {
    if (!refreshToken || refreshToken === '') {
      return null;
    }

    const hashedToken = this.hashRefreshToken(refreshToken);

    const currentRefreshToken = await this.refreshTokenRepository.findOne({
      where: {
        token: hashedToken,
      },
    });

    const now = Instant.now();
    if (!currentRefreshToken || currentRefreshToken.expires.isBefore(now)) {
      return null;
    }

    return currentRefreshToken;
  }
}
