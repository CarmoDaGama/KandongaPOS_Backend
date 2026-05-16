import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  refreshToken: string;

  @ApiProperty({
    example: {
      id: 'ckxyz123',
      phone: '+244912345678',
      name: 'Joao Pedro',
      role: 'END_USER',
    },
  })
  user: {
    id: string;
    phone: string;
    name: string;
    role: string;
  };
}
