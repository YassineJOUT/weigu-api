/*
  * @file-description : UsersController handles incoming requests for the endpoint users and sends responses
  * @author{Yassine JOUT} yassinejout@gmail.com
*/

// Import the required modules
import { Controller,Post,Get,Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common'
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UserDTO } from './user.model';

@Controller('users')
export class UsersController{
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
        ){}

    /**
     * Funciton: Login
     * @param req Request
     */
    @UseGuards(AuthGuard('local'))
    @Post('signin')
    async login(@Request() req){
        const data = await this.authService.login(req.user);
        return { status: 'success', token : data.access_token, user: data.user};
    }
    /**
     * Function: Profile -> Get profile Info
     * @param req Request
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
      return this.userService.profile(req.body.id);
    }

    /**
     * Function: Reset Password
     * @param req Request
     */
    @Post('resetPassword')
    changePwd(@Request() req) {
      const resultValue = this.userService.changePassword(req.body.email,req.body.confirmationCode,req.body.password);
      if(resultValue){
        // send email 
        return { 
        status: 'success',
        message : 'Your password has been changed successfully you can now authenticate'
      };
      } 
      else throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'This is a custom message',
      }, 401);
    }

  

    /**
     * Function: Password forgotten
     * @param req Request 
     */
    @Post('passwordForgotten')
    passwordForgotten(@Request() req) {
      return this.userService.passwordForgotten(req.body.email,req.body.confirmationCode);
    }

    /**
     * Function: Sign up
     * @param req Request
     */
    @Post('signup')
    addUser(@Request() req){
        const user = new UserDTO(req.body.username,req.body.email,req.body.password);
        return this.userService.insertUser(user);
    }
}