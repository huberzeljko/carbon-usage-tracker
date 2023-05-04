import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeRefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  refreshToken: string;
}
