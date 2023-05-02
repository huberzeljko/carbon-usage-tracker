import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
} from '@app/api/controllers/models';
import { AccountService } from '@app/application/account';
import { CurrentUser, Public } from '@app/shared/decorators';
import { JwtUser } from '@app/application/account/interfaces';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  async me(@CurrentUser() user: JwtUser): Promise<MeResponse> {
    const result = await this.accountService.getUserById(user.id);
    return result.user;
  }

  @Public()
  @Post('login')
  login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return this.accountService.login({
      name: request.userName,
      password: request.password,
    });
  }

  @Public()
  @Post('register')
  register(@Body() request: RegisterRequest): Promise<RegisterResponse> {
    return this.accountService.register(request);
  }
}
