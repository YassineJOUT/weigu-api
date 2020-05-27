/*
  * @file-description : this file provides validation method for token generation
  * @author{Yassine JOUT} yassinejout@gmail.com
*/

// Import the required modules
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { constants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}