import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET!,
            signOptions: { expiresIn: '7d' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }