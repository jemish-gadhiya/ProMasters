const { Response, Request, NextFunction } = require("express");
const jwt = require('jsonwebtoken');
const { dbReader, dbWriter } = require('../models/dbconfig');
const { SuccessResponse, AuthFailureError, BadRequestError, ApiError } = require('../core/index');

module.exports = async function tokenValidate(req, res, next) {
    try {
        if (req.headers.authorization) {
            // let access_token = req.headers.authorization;
            let access_token = req.headers.authorization.toString().split(" ")[1];
            jwt.verify(access_token.toString(), process.env.SECRET_KEY, async function (err, decoded) {
                if (err) {
                    ApiError.handle(new AuthFailureError("Invalid Token, Please re-login."), res);
                } else {
                    var user = await dbReader.usersLoginLogs.findOne({
                        where: { access_token: access_token.toString(), is_logout: 0 },
                    });
                    if (user) {
                        req.user_id = decoded.user_id;
                        req.role = decoded.role;
                        next();
                    } else {
                        ApiError.handle(new AuthFailureError("Invalid Token, Please re-login."), res);
                    }
                }
            });
        } else {
            ApiError.handle(new AuthFailureError("Invalid Token, Please re-login."), res);
        }
    } catch (err) {
        ApiError.handle(new AuthFailureError(err.message), res);
    }
}
