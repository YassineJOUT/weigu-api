/*
  * @file-description : this file provides validation method for local strategy 
  * @author{Yassine JOUT} yassinejout@gmail.com
*/

// Import the required modules
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({usernameField: 'email'});
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user.success) {
      return user
    }
    return user.data;
  }
}