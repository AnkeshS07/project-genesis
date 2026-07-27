import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../../users/user.enums';

export class SafeAuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;
}

export class AuthTokensResponseDto {
  @ApiProperty()
  accessToken!: string;
}

export class RegisterLoginResponseDto extends AuthTokensResponseDto {
  @ApiProperty({ type: SafeAuthUserDto })
  user!: SafeAuthUserDto;
}

export class MessageResponseDto {
  @ApiProperty()
  message!: string;
}
