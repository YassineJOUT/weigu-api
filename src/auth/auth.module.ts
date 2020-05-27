/*
  * @file-description : auth module -> authentication module that gathers the logic for local and JWT strategies
  * @author{Yassine JOUT} yassinejout@gmail.com
*/

// Import the required modules
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { constants } from './constants';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../db/schemas/user.schema';

@Module({
  imports: [
    AuthModule,MongooseModule.forFeature([{
      name: 'User', schema : UserSchema
  }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(
      {
        secret: constants.secret,
        signOptions: {
          expiresIn : '3600s'
        }
      }
    ),
  ],
  providers: [UsersService,AuthService, LocalStrategy,JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
