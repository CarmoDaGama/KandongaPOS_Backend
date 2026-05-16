import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@database/prisma.service';
import { SignUpDto, SignInDto, RefreshTokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { phone, name, password } = signUpDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new BadRequestException('Usuário já existe');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        phone,
        name,
        passwordHash: hashedPassword,
        role: 'END_USER',
        status: 'PENDING',
        isVerified: true, // TODO: Implement OTP verification
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    };
  }

  async signIn(signInDto: SignInDto) {
    const { phone, password } = signInDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new UnauthorizedException('Telefone ou senha inválidos');
    }

    if (user.status === 'REJECTED' || user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Usuário bloqueado');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Telefone ou senha inválidos');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const tokens = this.generateTokens(user.id);

      return {
        ...tokens,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          status: user.status,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  private generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: Number(this.configService.get('JWT_EXPIRATION')),
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: Number(this.configService.get('JWT_REFRESH_EXPIRATION')),
      },
    );

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (user.status === 'REJECTED' || user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Usuário bloqueado');
    }

    return user;
  }
}
