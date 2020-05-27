/*
  * @file-description : this file injects authentication, db logics to the users Module
  * @author{Yassine JOUT} yassinejout@gmail.com
*/

// Import the required modules
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from '../db/schemas/user.schema'
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports:[AuthModule,MongooseModule.forFeature([{
        name: 'User', schema : UserSchema
    }])],
    controllers : [UsersController],
    providers : [UsersService],
    exports : [UsersService]
})

export class UsersModule{}