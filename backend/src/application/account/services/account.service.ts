import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@app/domain';
import { ILike, Repository } from 'typeorm';
import {
  InvalidUserNameOrPasswordError,
  UserNameAlreadyExistsError,
} from '../errors';
import { JwtService } from './jwt.service';
import { PasswordService } from '@app/shared/services';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: { name: string; password: string }) {
    const user = await this.validateUser(data);
    const access_token = this.generateAccessToken(user);

    return {
      accessToken: access_token,
      user: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async register({
    name,
    firstName,
    lastName,
    password,
  }: {
    name: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
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

    return {
      user: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
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
}
