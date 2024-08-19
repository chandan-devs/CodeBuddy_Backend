// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UsersModule } from '../users/users.module';
// import { JwtModule } from '@nestjs/jwt';
// // import { UsersService } from 'src/users/users.service';
// import { JwtStrategy } from './jwt.strategy';
// // import { jwtConstants } from './constants';  // Define your JWT secret

// @Module({
//   imports: [
//     UsersModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET,
//       signOptions: { expiresIn: process.env.JWT_EXPIRATION },
//     }),
//   ],
//   providers: [AuthService, JwtStrategy],
//   controllers: [AuthController],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
// import { ConfigService } from '@nestjs/config';

// const configService = new ConfigService();
// console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET'));

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: (() => {
        
        const jwtSecret = process.env.JWT_SECRET;
        console.log('JWT_SECRET:', jwtSecret); // Logging JWT_SECRET
        return jwtSecret;
      })(),
      signOptions: {
        expiresIn: (() => {

          

          const jwtExpiration = process.env.JWT_EXPIRATION;
          console.log('JWT_EXPIRATION:', jwtExpiration); // Logging JWT_EXPIRATION
          return jwtExpiration;
        })(),
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
