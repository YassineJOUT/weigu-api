/*
 * @file-description : UsersController handles incoming requests for the endpoint users and sends responses
 * @author{Yassine JOUT} yassinejout@gmail.com
 */

// Import the required modules
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  Controller,
  Post,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Response,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import {
  sendSuccessRegisterEmail,
  magicLinkEmail,
} from 'src/utilities/sendMail';
import * as bcryptjs from 'bcryptjs';
import {
  USER_EXISTS,
  UNKNOWN_ERROR,
  USER_EMAIL_NOT_SUPPLIED,
  USER_ACCOUNT_DOESNOT_EXIST,
  USER_SUCCESS_REGISTER,
  USER_ID_WAS_NOT_PROVIDED,
  UNKNOWN_USER,
} from 'src/utilities/constants';
import { config } from 'dotenv';
import { UserDTO } from './user.model';
import { editFileName, imageFileFilter } from 'src/utilities/fileUpload';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
config();

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
    if (data.success)
      req.res.cookie('token', data.data.access_token, { httpOnly: true });
    return data;
  }

  @Post('linkVerify')
  verifyLink(@Request() req) {
    if (!req.body.token)
      return {
        success: false,
        error: 'invalid link',
      };
    req.res.cookie('token', req.body.token, { httpOnly: true });
    return {
      success: true,
    };
  }

  /**
   * Funciton: Login
   * @param req Request
   */
  @Post('linkSignin')
  async loginMagicLink(@Request() req) {
    if (!req.body.email)
      return {
        success: false,
        error: USER_EMAIL_NOT_SUPPLIED,
      };

    const emailExists = await this.userService.findUser(req.body.email);

    if (emailExists) {
      magicLinkEmail(
        req.body.email,
        process.env.FRONT_HOST +
          '/mlink/' +
          (await this.authService.makeJwtLink({
            id: emailExists._id,
          })),
      );
      return {
        success: true,
        payload: emailExists._id,
      };
    } else {
      return {
        success: false,
        error: USER_ACCOUNT_DOESNOT_EXIST,
      };
    }
  }
  /**
   * Function: Profile -> Get profile Info
   * @param req Request
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  async getProfile(@Body() body) {
    if (body.userId) {
      const user = await this.userService.findUser(body.userId);
      if (!user) return { success: false, error: UNKNOWN_USER };
      const { password: old, ...resultset } = user;
      const { password, __v, ...resul } = resultset._doc;
      return {
        success: true,
        data: resul,
      };
    }
    return { success: false, error: USER_ID_WAS_NOT_PROVIDED };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }
  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('editProfile')
  async updateProfile(@Body() userDto: UserDTO) {
    const updated = await this.userService.editProfile(userDto);
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
  async signUp(@Request() req) {
    const emailExists = await this.userService.findUser(req.body.email);
    // this is to be dropped
    if (emailExists) {
      return {
        success: false,
        error: {
          message: USER_EXISTS,
        },
      };
    }
    const password = await bcryptjs.hash(req.body.password, 10);

    try {
      const created = await this.userService.insertUser({
        username: req.body.username,
        email: req.body.email,
        password,
      });
      if (created) {
        sendSuccessRegisterEmail(req.body.email);
        return {
          success: true,
          message: USER_SUCCESS_REGISTER,
        };
      } else {
        return {
          success: false,
          error: USER_EXISTS,
        };
      }
    } catch (err) {
      return {
        success: false,
        error: UNKNOWN_ERROR,
      };
    }
  }
}
