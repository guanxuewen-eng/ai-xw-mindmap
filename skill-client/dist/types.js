"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillError = void 0;
class SkillError extends Error {
    code;
    statusCode;
    details;
    constructor(code, message, statusCode, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'SkillError';
    }
}
exports.SkillError = SkillError;
//# sourceMappingURL=types.js.map