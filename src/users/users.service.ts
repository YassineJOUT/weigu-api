/*
 * @file-description : provides functions that manipulates users
 * @author{Yassine JOUT} yassinejout@gmail.com
 */

// Import the required modules
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { User, UserDTO } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendConfirmationCodeByMail } from '../utilities/sendMail';
import * as bcrypt from 'bcryptjs';
import _ from 'lodash';

@Injectable()
export class UsersService {
  private readonly users: UserDTO[];

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findUser(payload: string, isEmail = false): Model<User> {
    let u = null;
    if (isEmail) u = await this.userModel.findOne({ email: payload });
    else u = await this.userModel.findOne({ _id: payload });

    if (u !== null) return u;

    return u;
  }

  async insertUser(userDto: UserDTO) {
    const u = await this.userModel.findOne({ email: userDto.email });
    if (!u) {
      const user = new this.userModel({
        username: userDto.username,
        email: userDto.email,
        password: userDto.password,
        coverImage: 'default-cover.png',
        profileImage: 'default-profile.png',
      });
      return await user.save();
    }
    return null;
  }

  async changePassword(
    email: string,
    confirmationCode: string,
    new_password: string,
  ) {
    const user = await this.userModel.findOne({ email: email });

    if (user !== null && user.confirmationCode === parseInt(confirmationCode)) {
      user.password = new_password;
      user.confirmationCode = 0;
      user.save();
      return true;
    }
    return false;
  }

  async passwordForgotten(email: string, confirmCode: string) {
    const u = await this.userModel.findOne({ email: email });
    if (u === null)
      throw new HttpException(
        {
          status: HttpStatus.NO_CONTENT,
          error: 'This is a custom message',
        },
        204,
      );

    let result = {};
    if (confirmCode !== '') {
      let c = parseInt(confirmCode);
      if (u.confirmationCode === c) {
        result = {
          message: 'Code matches ' + confirmCode + ' ' + u.confirmationCode,
          match: true,
        };
      } else {
        result = {
          message: 'Success ur code is ' + confirmCode,
          match: false,
        };
      }
    } else {
      let confirmationCode = Math.floor(1000 + Math.random() * 9000);
      // persist the confirmation code
      await this.userModel.update(
        { _id: u._id },
        { $set: { confirmationCode: confirmationCode } },
      );
      // send confirmation email

      sendConfirmationCodeByMail(email, confirmationCode);

      result = {
        message: 'An email was send with a confirmation code.',
      };
    }
    // return response
    return result;
  }

  async profile(id: string): Model<User> {
    return await this.userModel.findById(id);
  }

  async editProfile(userDto: UserDTO): Model<User> {
    if (!(userDto.id.length > 0)) return false;
    const user = await this.userModel.findOne({ _id: userDto.id });

    if (user !== null) {
      if (userDto.profileImage) user.profileImage = userDto.profileImage;
      if (userDto.coverImage) user.coverImage = userDto.coverImage;
      if (userDto.bio) user.bio = userDto.bio;
      if (userDto.address) user.address = userDto.address;
      if (userDto.password)
        user.password = await bcrypt.hash(userDto.password, 10);
      user.save();
      // format response
      return true;
    }
    //format response
    return false;
  }
}
