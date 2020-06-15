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
const bcryptjs = require("bcryptjs");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("../utilities/constants");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findUser(email, true);
        if (!user) {
            return {
                success: false,
                error: constants_1.USER_INCORRECT_CREDENTIALS,
            };
        }
        const valid = await bcryptjs.compare(pass, user.password);
        if (!valid) {
            return {
                success: false,
                error: constants_1.USER_INCORRECT_CREDENTIALS,
            };
        }
        const { password: orig } = user, resultset = __rest(user, ["password"]);
        const _a = resultset._doc, { password, __v } = _a, result = __rest(_a, ["password", "__v"]);
        return {
            data: result,
            success: true,
        };
    }
    async makeJwtLink(payload) {
        if (payload)
            return this.jwtService.sign(payload);
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
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map