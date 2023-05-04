import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@app/domain';
import { ILike, Repository } from 'typeorm';
import {
  InvalidRefreshTokenError,
  InvalidUserNameOrPasswordError,
  UserNameAlreadyExistsError,
} from '../errors';
import { JwtService } from './jwt.service';
import { PasswordService } from '@app/shared/services';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenService } from './refresh-token.service';
import { TokenResponseDto } from '@app/application/account/dtos/token-response.dto';
import { LoginDto, RegisterDto } from '@app/application/account';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async login(
    data: LoginDto & {
      remoteIpAddress: string;
    },
  ): Promise<TokenResponseDto> {
    const user = await this.validateUser(data);

    const tokens = await this.getTokens({
      user,
      remoteIpAddress: data.remoteIpAddress,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async register({
    name,
    firstName,
    lastName,
    password,
    remoteIpAddress,
  }: RegisterDto & {
    remoteIpAddress: string;
  }): Promise<TokenResponseDto> {
    const nameExists = await this.userRepository.exist({
      where: { name: ILike(name) },
    });

    if (nameExists) {
      throw new UserNameAlreadyExistsError();
    }

    const user = this.userRepository.create({
      name,
      firstName,
      lastName,
      password: await this.passwordService.hashPassword(password),
    });

    await this.userRepository.save(user);

    return await this.getTokens({ user, remoteIpAddress });
  }

  async exchangeRefreshToken({
    refreshToken,
    remoteIpAddress,
  }: {
    refreshToken: string;
    remoteIpAddress: string;
  }): Promise<TokenResponseDto> {
    const tokenEntity = await this.refreshTokenService.verifyRefreshToken(
      refreshToken,
    );

    if (!tokenEntity) {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepository.findOne({
      where: { id: tokenEntity.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.refreshTokenService.removeRefreshToken(tokenEntity);

    return await this.getTokens({
      user,
      remoteIpAddress: remoteIpAddress,
    });
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async validateUser({
    name,
    password,
  }: {
    name: string;
    password: string;
  }): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { name: ILike(name) },
    });

    if (!user) {
      throw new InvalidUserNameOrPasswordError();
    }

    if (
      !(await this.passwordService.comparePassword(password, user.password))
    ) {
      throw new InvalidUserNameOrPasswordError();
    }

    return user;
  }

  generateAccessToken(user: UserEntity): string {
    const { token } = this.jwtService.sign({
      id: user.id,
      name: user.name,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    });

    return token;
  }

  private async getTokens({
    user,
    remoteIpAddress,
  }: {
    user: UserEntity;
    remoteIpAddress?: string;
  }): Promise<TokenResponseDto> {
    const { clearTextRefreshToken } =
      await this.refreshTokenService.addRefreshToken(user, remoteIpAddress);

    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: clearTextRefreshToken,
    };
  }
}
