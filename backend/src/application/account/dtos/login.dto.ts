import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class LoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserDto;
}
