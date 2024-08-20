import { Controller, Post, Body, UseGuards, Get, UnauthorizedException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from '../common/dto/user.create.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  
  @Get('verify')
  async verify(@Query('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('Token must be provided');
    }

    const user = await this.authService.verifyUser(token);
    return {
      message: 'User is verified',
      user: user, // Return the user data
    };
  }
}
