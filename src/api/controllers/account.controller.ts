import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  AccountService,
  ExchangeRefreshTokenDto,
  LoginDto,
  RegisterDto,
  TokenResponseDto,
  UserDto,
} from '@app/application/account';
import { CurrentUser, Public, RemoteIpAddress } from '@app/shared/decorators';
import { JwtUser } from '@app/application/account/interfaces';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
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
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({
    type: LoginDto,
  })
  login(
    @Body() request: LoginDto,
    @RemoteIpAddress() remoteIpAddress: string,
  ): Promise<TokenResponseDto> {
    return this.accountService.login({
      ...request,
      remoteIpAddress,
    });
  }

  @Public()
  @Post('exchange-refresh-token')
  @ApiCreatedResponse({
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({
    type: ExchangeRefreshTokenDto,
  })
  exchangeRefreshToken(
    @Body() request: ExchangeRefreshTokenDto,
    @RemoteIpAddress() remoteIpAddress: string,
  ): Promise<TokenResponseDto> {
    return this.accountService.exchangeRefreshToken({
      refreshToken: request.refreshToken,
      remoteIpAddress: remoteIpAddress,
    });
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse({
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Username already exists' })
  @ApiBody({
    type: RegisterDto,
  })
  register(
    @Body() request: RegisterDto,
    @RemoteIpAddress() remoteIpAddress: string,
  ): Promise<TokenResponseDto> {
    return this.accountService.register({ ...request, remoteIpAddress });
  }
}
