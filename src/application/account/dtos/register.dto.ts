import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  lastName?: string;
}
