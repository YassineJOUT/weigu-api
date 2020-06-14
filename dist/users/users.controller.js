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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("./users.service");
const sendMail_1 = require("../utilities/sendMail");
const bcryptjs = require("bcryptjs");
const constants_1 = require("../utilities/constants");
const dotenv_1 = require("dotenv");
const user_model_1 = require("./user.model");
const fileUpload_1 = require("../utilities/fileUpload");
dotenv_1.config();
let UsersController = class UsersController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async login(req) {
        const data = await this.authService.login(req.user);
        if (data.success)
            req.res.cookie('token', data.data.access_token, { httpOnly: true });
        return data;
    }
    verifyLink(req) {
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
    async loginMagicLink(req) {
        if (!req.body.email)
            return {
                success: false,
                error: constants_1.USER_EMAIL_NOT_SUPPLIED,
            };
        const emailExists = await this.userService.findUser(req.body.email, true);
        if (emailExists) {
            sendMail_1.magicLinkEmail(req.body.email, process.env.FRONT_HOST +
                '/mlink/' +
                (await this.authService.makeJwtLink({
                    id: emailExists._id,
                })));
            return {
                success: true,
                payload: emailExists._id,
            };
        }
        else {
            return {
                success: false,
                error: constants_1.USER_ACCOUNT_DOESNOT_EXIST,
            };
        }
    }
    async getProfile(body) {
        if (body.userId) {
            const user = await this.userService.findUser(body.userId);
            if (!user)
                return { success: false, error: constants_1.UNKNOWN_USER };
            const { password: old } = user, resultset = __rest(user, ["password"]);
            const _a = resultset._doc, { password, __v } = _a, resul = __rest(_a, ["password", "__v"]);
            return {
                success: true,
                data: resul,
            };
        }
        return { success: false, error: constants_1.USER_ID_WAS_NOT_PROVIDED };
    }
    async uploadedFile(file, body) {
        console.log(body.userId);
        const user = await this.userService.findUser(body.userId);
        if (!user)
            return { success: false, error: constants_1.UNKNOWN_USER };
        let dto = new user_model_1.UserDTO();
        dto.id = body.userId;
        if (body.type === 'profile')
            dto.profileImage = file.filename;
        else if (body.type === 'cover')
            dto.coverImage = file.filename;
        const updated = await this.userService.editProfile(dto);
        if (!updated) {
            return { success: false, error: 'Profile edit did not succeed' };
        }
        const response = {
            success: true,
            data: { originalname: file.originalname, filename: file.filename },
        };
        return response;
    }
    seeUploadedFile(image, res) {
        return res.sendFile(image, { root: './files' });
    }
    async updateProfile(userDto) {
        const updated = await this.userService.editProfile(userDto);
        if (!updated) {
            return { success: false, error: 'Profile edit did not succeed' };
        }
        return { success: true };
    }
    changePwd(req) {
        const resultValue = this.userService.changePassword(req.body.email, req.body.confirmationCode, req.body.password);
        if (resultValue) {
            return {
                status: 'success',
                message: 'Your password has been changed successfully you can now authenticate',
            };
        }
        else
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNAUTHORIZED,
                error: 'This is a custom message',
            }, 401);
    }
    passwordForgotten(req) {
        return this.userService.passwordForgotten(req.body.email, req.body.confirmationCode);
    }
    async signUp(req) {
        const emailExists = await this.userService.findUser(req.body.email, true);
        if (emailExists) {
            return {
                success: false,
                error: {
                    message: constants_1.USER_EXISTS,
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
                sendMail_1.sendSuccessRegisterEmail(req.body.email);
                return {
                    success: true,
                    message: constants_1.USER_SUCCESS_REGISTER,
                };
            }
            else {
                return {
                    success: false,
                    error: constants_1.USER_EXISTS,
                };
            }
        }
        catch (err) {
            return {
                success: false,
                error: constants_1.UNKNOWN_ERROR,
            };
        }
    }
};
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('local')),
    common_1.Post('signin'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    common_1.Post('linkVerify'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "verifyLink", null);
__decorate([
    common_1.Post('linkSignin'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "loginMagicLink", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    common_1.Post('profile'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    common_1.Post('upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('image', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: fileUpload_1.editFileName,
        }),
        fileFilter: fileUpload_1.imageFileFilter,
    })),
    __param(0, common_1.UploadedFile()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadedFile", null);
__decorate([
    common_1.Get(':imgpath'),
    __param(0, common_1.Param('imgpath')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "seeUploadedFile", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    common_1.Post('editProfile'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.UserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    common_1.Post('resetPassword'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changePwd", null);
__decorate([
    common_1.Post('passwordForgotten'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "passwordForgotten", null);
__decorate([
    common_1.Post('signup'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signUp", null);
UsersController = __decorate([
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map