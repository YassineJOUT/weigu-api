/*
 * @file-description : UsersController handles incoming requests for the endpoint users and sends responses
 * @author{Yassine JOUT} yassinejout@gmail.com
 */

// Import the required modules
import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Response,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UserDTO } from './user.model';
import { sendSuccessEmail } from 'src/utilities/sendMail';
import * as bcryptjs from 'bcryptjs';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Funciton: Login
   * @param req Request
   */
  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async login(@Request() req) {
    const data = await this.authService.login(req.user);
    console.log(data)
    if (data.success)
      req.res.cookie('token', data.data.access_token, { httpOnly: true });

    return data;
  }
  /**
   * Function: Profile -> Get profile Info
   * @param req Request
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  getProfile(@Request() req) {
    //return .this.userService.profile(req.body.id);
    return { success: true };
  }

  /**
   * Function: Reset Password
   * @param req Request
   */
  @Post('resetPassword')
  changePwd(@Request() req) {
    const resultValue = this.userService.changePassword(
      req.body.email,
      req.body.confirmationCode,
      req.body.password,
    );
    if (resultValue) {
      // send email
      return {
        status: 'success',
        message:
          'Your password has been changed successfully you can now authenticate',
      };
    } else
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'This is a custom message',
        },
        401,
      );
  }

  /**
   * Function: Password forgotten
   * @param req Request
   */
  @Post('passwordForgotten')
  passwordForgotten(@Request() req) {
    return this.userService.passwordForgotten(
      req.body.email,
      req.body.confirmationCode,
    );
  }

  /**
   * Function: Sign up
   * @param req Request
   */
  @Post('signup')
  async addUser(@Request() req) {
    const emailExists = await this.userService.findUser(req.body.email);
    // this is to be dropped
    if (emailExists) {
      throw Error('Email is already in use');
    }
    const password = await bcryptjs.hash(req.body.password, 10);

    const user = await this.userService.insertUser({
      username: req.body.username,
      email: req.body.email,
      password,
    });
    console.log(user)
    return {
      success: true,
    };
  }
}
