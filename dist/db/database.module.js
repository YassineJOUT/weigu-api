"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("@nestjs/mongoose");
const dotenv_1 = require("dotenv");
dotenv_1.config();
exports.dbModule = mongoose_1.MongooseModule.forRoot(process.env.MOGOOS_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
//# sourceMappingURL=database.module.js.map