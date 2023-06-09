import { BadRequestException, ConflictException } from '@nestjs/common';

export class InvalidUserNameOrPasswordError extends BadRequestException {
  constructor() {
    super('account/auth/invalid-username-or-password');
  }
}

export class InvalidRefreshTokenError extends BadRequestException {
  constructor() {
    super('account/auth/invalid-refresh-token');
  }
}

export class UserNameAlreadyExistsError extends ConflictException {
  constructor() {
    super('account/auth/username-already-exists');
  }
}
