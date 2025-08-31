import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@expanders360.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123', description: 'User password' })
  @IsString()
  password: string;
}
