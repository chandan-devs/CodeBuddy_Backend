import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, LoginDto } from 'src/common/dto/user.create.dto';
import { User } from 'src/common/entity/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = { ...createUserDto, password: hashedPassword };
    return this.usersService.create(newUser);
    
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { email: user.email, sub: user.id , role: user.role};
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.log('Error whlile login ', error);
      throw new InternalServerErrorException('Error while logign', error);
    }
  }

  async verifyUser(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      console.log(decoded)
      const user = await this.usersService.findOne(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
