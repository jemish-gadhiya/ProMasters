"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRefreshResponse = exports.AccessTokenErrorResponse = exports.SuccessResponse = exports.FailureMsgResponse = exports.SuccessMsgResponse = exports.InternalErrorResponse = exports.BadRequestResponse = exports.ForbiddenResponse = exports.NotFoundResponse = exports.AuthFailureResponse = void 0;
const { dbWriter } = require('../models/dbconfig');
// Helper code for the API consumer to understand the error and handle is accordingly
var status_code;
(function (status_code) {
    status_code[status_code["SUCCESS"] = 200] = "SUCCESS";
    status_code[status_code["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    status_code[status_code["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    status_code[status_code["FORBIDDEN"] = 403] = "FORBIDDEN";
    status_code[status_code["NOT_FOUND"] = 404] = "NOT_FOUND";
    status_code[status_code["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(status_code || (status_code = {}));
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["SUCCESS"] = 200] = "SUCCESS";
    ResponseStatus[ResponseStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ResponseStatus[ResponseStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ResponseStatus[ResponseStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    ResponseStatus[ResponseStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    ResponseStatus[ResponseStatus["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(ResponseStatus || (ResponseStatus = {}));
class ApiResponse {
    constructor(status_code, status, message) {
        this.status_code = status_code;
        this.status = status;
        this.message = message;
    }
    prepare(res, response) {
        try {
            let apiResponse = JSON.stringify(response);
            let endTime = Date.now();
            let startTime = res.req.startTime
            let executionTime = endTime-startTime
            console.log(executionTime);
            let data =  dbWriter.apiLogs.create({
                api_name:res.req.originalUrl,
                request:  JSON.stringify(res.req.body) || JSON.stringify(res.req.params),
                response: apiResponse,
                user_id: res.req.user_id || 0,
                execution_time:executionTime
            })

        }
        catch (e) {
            console.log(e);
        }
         return res.status(this.status).json(ApiResponse.sanitize(response));
    }
    send(res) {
        return this.prepare(res, this);
    }
    static sanitize(response) {
        const clone = {};
        Object.assign(clone, response);
        // @ts-ignore
        delete clone.status;
        for (const i in clone)
            if (typeof clone[i] === 'undefined')
                delete clone[i];
        return clone;
    }
}
class AuthFailureResponse extends ApiResponse {
    constructor(message = 'Authentication Failure') {
        super(status_code.UNAUTHORIZED, ResponseStatus.UNAUTHORIZED, message);
    }
}
exports.AuthFailureResponse = AuthFailureResponse;
class NotFoundResponse extends ApiResponse {
    constructor(message = 'Not Found') {
        super(status_code.NOT_FOUND, ResponseStatus.NOT_FOUND, message);
    }
    send(res) {
        var _a;
        this.url = (_a = res.req) === null || _a === void 0 ? void 0 : _a.originalUrl;
        return super.prepare(res, this);
    }
}
exports.NotFoundResponse = NotFoundResponse;
class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Forbidden') {
        super(status_code.FORBIDDEN, ResponseStatus.FORBIDDEN, message);
    }
}
exports.ForbiddenResponse = ForbiddenResponse;
class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters') {
        super(status_code.BAD_REQUEST, ResponseStatus.BAD_REQUEST, message);
    }
}
exports.BadRequestResponse = BadRequestResponse;
class InternalErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error') {
        super(status_code.INTERNAL_ERROR, ResponseStatus.INTERNAL_ERROR, message);
    }
}               
exports.InternalErrorResponse = InternalErrorResponse;
class SuccessMsgResponse extends ApiResponse {
    constructor(message) {
        super(status_code.SUCCESS, ResponseStatus.SUCCESS, message);
    }
}
exports.SuccessMsgResponse = SuccessMsgResponse;
class FailureMsgResponse extends ApiResponse {
    constructor(message) {
        super(status_code.INTERNAL_ERROR, ResponseStatus.SUCCESS, message);
    }
}
exports.FailureMsgResponse = FailureMsgResponse;
class SuccessResponse extends ApiResponse {
    constructor(message, data) {
        super(status_code.SUCCESS, ResponseStatus.SUCCESS, message);
        // if (token)this.token = token
        this.data = data;
    }
    send(res) {
        return super.prepare(res, this);
    }
}
exports.SuccessResponse = SuccessResponse;
class AccessTokenErrorResponse extends ApiResponse {
    constructor(message = 'Access token invalid') {
        super(status_code.UNAUTHORIZED, ResponseStatus.UNAUTHORIZED, message);
        this.instruction = 'refresh_token';
    }
    send(res) {
        res.setHeader('instruction', this.instruction);
        return super.prepare(res, this);
    }
}
exports.AccessTokenErrorResponse = AccessTokenErrorResponse;
class TokenRefreshResponse extends ApiResponse {
    constructor(message, accessToken, refreshToken) {
        super(status_code.SUCCESS, ResponseStatus.SUCCESS, message);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
    send(res) {
        return super.prepare(res, this);
    }
}
exports.TokenRefreshResponse = TokenRefreshResponse;