import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, required: false })
  firstName?: string;

  @ApiProperty({ nullable: true, required: false })
  lastName?: string;
}
