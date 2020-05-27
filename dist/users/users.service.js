"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const user_model_1 = require("./user.model");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sendMail_1 = require("../utilities/sendMail");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findUser(email) {
        console.log('finduser');
        console.log(email);
        const u = await this.userModel.findOne({ email });
        console.log('u');
        console.log(u);
        if (u !== null) {
            const user = new user_model_1.UserDTO(u.username, u.email, u.password, u._id);
            return user;
        }
        return null;
    }
    async insertUser(userDto) {
        const u = await this.userModel.findOne({ email: userDto.email });
        if (!u) {
            const user = new this.userModel({ username: userDto.username, email: userDto.email, password: userDto.password });
            const result = await user.save();
            return result._id;
        }
        return "User Alerady exists";
    }
    async changePassword(email, confirmationCode, new_password) {
        const user = await this.userModel.findOne({ email: email });
        if (user !== null && user.confirmationCode === parseInt(confirmationCode)) {
            user.password = new_password;
            user.confirmationCode = 0;
            user.save();
            return true;
        }
        return false;
    }
    async passwordForgotten(email, confirmCode) {
        const u = await this.userModel.findOne({ email: email });
        if (u === null)
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NO_CONTENT,
                error: 'This is a custom message',
            }, 204);
        let result = {};
        if (confirmCode !== '') {
            let c = parseInt(confirmCode);
            if (u.confirmationCode === c) {
                result = {
                    message: "Code matches " + confirmCode + " " + u.confirmationCode,
                    match: true
                };
            }
            else {
                result = {
                    message: "Success ur code is " + confirmCode,
                    match: false
                };
            }
        }
        else {
            let confirmationCode = Math.floor(1000 + Math.random() * 9000);
            await this.userModel.update({ "_id": u._id }, { $set: { "confirmationCode": confirmationCode } });
            sendMail_1.sendConfirmationCodeByMail(email, confirmationCode);
            result = {
                message: "An email was send with a confirmation code.",
            };
        }
        return result;
    }
    async profile(id) {
        return await this.userModel.findById(id);
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map