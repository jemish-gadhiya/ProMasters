const {
    NextFunction,
    Request,
    response
} = require('express');
const {
    SuccessResponse,
    BadRequestError,
    ApiError,
    UAParser,
} = require('../core/index');
const {
    remoteIP
} = require('../helpers/helpers');
const {
    dbReader,
    dbWriter
} = require('../models/dbconfig');
const { Configuration, OpenAIApi } = require("openai");
const moment = require('moment');
const index_1 = require("../core/index");
const nodeMailerController_1 = require("./nodeMailerController");
var crypto = new index_1.crypto_1();
const jwt = require("jsonwebtoken");
require('dotenv').config()
const enumerationController = require("./enumurationController");
var ObjectMail = new nodeMailerController_1();
var EnumObject = new enumerationController();
class AuthController {

    login = async (req, res) => {
        try {
            let { email, password } = req.body
            password = crypto.encrypt(password.toString(), true).toString();
            let userExistData = await dbReader.users.findOne({
                // attributes: ["user_id", "first_name", "last_name", "password", "email", "created_at", "status"],
                where: {
                    email: email,
                    is_deleted:0
                }
            })
            userExistData = JSON.parse(JSON.stringify(userExistData))
            if (!userExistData) {
                ApiError.handle(new BadRequestError("Invalid login attempt."), res);
            } else {
                if (userExistData.password == password) {
                    let UA_string = req.headers['user-agent'];
                    const UA = new UAParser(UA_string);
                    let userData = {
                        user_id: userExistData.user_id,
                        status: userExistData.status,
                    };
                    let userAgent = {
                        browser_name: UA.getBrowser().name,
                        browser_version: UA.getBrowser().version,
                        engine_name: UA.getEngine().name,
                        engine_version: UA.getEngine().version,
                        os: UA.getOS().name,
                        os_ver: UA.getOS().version,
                        cpu: UA.getCPU().architecture,
                        ua: UA.getUA()
                    }
                    let access_token = jwt.sign(userData, process.env.SECRET_KEY, {
                        // expiresIn: '24h' // expires in 24 hours
                    });

                    await dbWriter.usersLoginLogs.create({
                        user_id: userExistData.user_id,
                        access_token: access_token,
                        system_info: JSON.stringify(userAgent),
                        login_ip_address: await remoteIP(req),
                        access_token_expire_at: moment().add('24', 'hours')
                    })
                    let responseData = {
                        first_name: userExistData.first_name,
                        last_name: userExistData.last_name,
                        email: userExistData.email,
                        created_at: userExistData.created_at
                    }
                    res.send({
                        status_code: 200,
                        message: "Login successfully.",
                        token: access_token,
                        data: responseData
                    })
                    //  new SuccessResponse("Login successfully.", {
                    //     token: access_token,
                    //     ...responseData
                    // }).send(res);
                } else {
                    ApiError.handle(new BadRequestError("Invalid login attempt."), res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    logOut = async (req, res) => {
        try {
            let { token } = req.body
            let { user_id } = req
            let loggedUser = await dbReader.usersLoginLogs.findOne({
                where: {
                    access_token: token,
                    user_id: user_id
                }
            })
            loggedUser = JSON.parse(JSON.stringify(loggedUser))
            if (loggedUser) {
                await dbWriter.usersLoginLogs.update({
                    is_logout: 1,
                    access_token: '',
                    logout_at: new Date()
                }, {
                    where: {
                        access_token: token,
                        user_id: user_id
                    }
                })
                // res.send({
                //     status_code: 200,
                //     message: "Logout successfully.",
                // })
                new SuccessResponse("Logout successfully.", {}).send(res);
            } else {
                ApiError.handle(new BadRequestError("Something Went Wrong"), res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    forgotPassword = async (req, res) => {
        try {
            let { email } = req.body
            let ExistUser = await dbReader.users.findOne({
                where: {
                    email: email
                }
            })
            ExistUser = JSON.parse(JSON.stringify(ExistUser))
            if (ExistUser) {
                let payload = {
                    user_id: ExistUser.user_id,
                    email: ExistUser.email,
                    first_name: ExistUser.first_name,
                    templateIdentifier: EnumObject.templateIdentifier.get('resetPassword').value,
                }
                let enc = crypto.encrypt(JSON.stringify(payload), false);
                let url = "http://192.168.1.168:3000/" + 'reset-password?token=' + enc;
                payload.redirect_url = url
                await dbWriter.users.update({
                    reset_token: enc.toString()
                }, {
                    where: { user_id: ExistUser.user_id }
                });
                await ObjectMail.ConvertData(payload, function (data) { });
                // res.send({
                //     status_code: 200,
                //     message: "Logout successfully.",
                // })
                new SuccessResponse("Reset password link has been sent to your email address", {}).send(res);
            } else {
                ApiError.handle(new BadRequestError("Email Does not exist"), res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    validateResetPasswordToken = async (req, res) => {
        try {
            let token = req.body.token || req.query.token || req.headers["x-access-token"];
            let user_token_match = await dbReader.users.findOne({
                where: { reset_token: token }
            });
            if (user_token_match) {
                token = crypto.decrypt(token);
                let payload = JSON.parse(token);
                let final_payload = {
                    user_id: payload.user_id,
                    email: payload.email,
                };
                return new SuccessResponse("Request successfully.", {
                    ...final_payload
                }).send(res);
            } else {
                throw new Error("Token expire.");
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    resetUserPassword = async (req, res) => {
        try {
            let { email, confirmPassword, newPassword, token } = req.body
            let { user_id } = req
            let user_token_match = await dbReader.users.findOne({
                where: { reset_token: token }
            });
            if (user_token_match) {
                let ExistUser = await dbReader.users.findOne({
                    where: {
                        email: email
                    }
                })
                ExistUser = JSON.parse(JSON.stringify(ExistUser))
                if (ExistUser) {
                    if (newPassword == confirmPassword) {
                        newPassword = crypto.encrypt(newPassword.toString(), true).toString();
                        await dbWriter.users.update({
                            password: newPassword,
                            reset_token: ""
                        }, {
                            where: {
                                email: email
                            }
                        })
                        new SuccessResponse("Password changed successfully.", {}).send(res);
                    } else {
                        ApiError.handle(new BadRequestError("Password is not matching"), res);
                    }
                    // res.send({
                    //     status_code: 200,
                    //     message: "Logout successfully.",
                    // })
                } else {
                    ApiError.handle(new BadRequestError("Email Does not exist"), res);
                }
            } else {
                throw new Error("Token expire.");
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    frontEndErrorLog = async (req, res) => {
        try {
            let { securityToken, request, errorMessage, description } = req.body
            let key = 'umOWNKmERpj7jvDFs3pp0nRDkNCSQH9g'
            let decodeData = crypto.aesDecrypt(securityToken, key)
            if (decodeData) {
                await dbWriter.frontendErrorLogs.create({
                    security_token: securityToken,
                    request: request,
                    headers: JSON.stringify(req.headers),
                    error_message: errorMessage,
                    description: description
                })
            }
            // res.send({
            //     status_code: 200,
            //     message: "request successfully.",
            // })
            new SuccessResponse("request successfully.", {}).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

}

module.exports = AuthController;