import { IsNotEmpty, IsString } from 'class-validator';
import { MeResponse } from './me.model';

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: MeResponse;
}
