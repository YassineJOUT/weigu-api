"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmationCode: { type: Number, required: false },
    bio: { type: String, required: false },
    address: { type: String, required: false },
    nameHolder: { type: String, required: false },
    coverImage: { type: String, required: false },
    profileImage: { type: String, required: false }
});
//# sourceMappingURL=user.schema.js.map