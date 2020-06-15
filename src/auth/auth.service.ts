/*
 * @file-description : Authentication service provide user validation and JWT token generation
 * @author{Yassine JOUT} yassinejout@gmail.com
 */

// Import the required modules
import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  USER_EXISTS,
  USER_INCORRECT_CREDENTIALS,
} from 'src/utilities/constants';
import { constants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(email,true);

    if (!user) {
      return {
        success: false,
        error: USER_INCORRECT_CREDENTIALS,
      };
    }

    const valid = await bcryptjs.compare(pass, user.password);

    if (!valid) {
      return {
        success: false,
        error: USER_INCORRECT_CREDENTIALS,
      };
    }
    // remove password from object
    const { password: orig, ...resultset } = user;
    const { password, __v, ...result } = resultset._doc;
    return {
      data: result,
      success: true,
    };
  }

  async makeJwtLink(payload) {
    if (payload) return this.jwtService.sign(payload);
    return null;
  }
  async decodeJwt(token) {
    const t = this.jwtService.verify(token);
    return t;
  }

  async login(user) {
    if (user.success) {
      const payload = { id: user.data._id };

      const userD = user.data;
      return {
        success: true,
        data: {
          access_token: this.jwtService.sign(payload),
          user: userD,
        },
      };
    }
    return user;
  }
}
