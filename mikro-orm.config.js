"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("./config.json"));
exports.default = {
    entities: ['./models/mikroorm/entities/**/*.js'],
    debug: true,
    dbName: 'transportation',
    type: 'mysql',
    user: config_json_1.default.db_username,
    password: config_json_1.default.db_password
};
//# sourceMappingURL=mikro-orm.config.js.map