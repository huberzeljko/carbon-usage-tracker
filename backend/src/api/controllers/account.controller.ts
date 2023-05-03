import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  AccountService,
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  UserDto,
} from '@app/application/account';
import { CurrentUser, Public } from '@app/shared/decorators';
import { JwtUser } from '@app/application/account/interfaces';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiBearerAuth()
  async me(@CurrentUser() user: JwtUser): Promise<UserDto> {
    const result = await this.accountService.getUserById(user.id);
    return result.user;
  }

  @Public()
  @Post('login')
  @ApiCreatedResponse({
    type: LoginResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({
    type: LoginDto,
  })
  login(@Body() request: LoginDto): Promise<LoginResponse> {
    return this.accountService.login({
      name: request.userName,
      password: request.password,
    });
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse({
    type: RegisterResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Username already exists' })
  @ApiBody({
    type: RegisterDto,
  })
  register(@Body() request: RegisterDto): Promise<RegisterResponse> {
    return this.accountService.register(request);
  }
}
