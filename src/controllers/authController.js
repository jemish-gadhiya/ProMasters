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
    remoteIP,
    generateRandomNo
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
    register = async (req, res) => {
        try {
            let { name, username, email, contact, password, google_signup = "", latitude = "", longitude = "", role, photo = "", address = "", city = "", state = "", country = "", experience = "" } = req.body;
            password = crypto.encrypt(password.toString(), true).toString();

            let userData = await dbReader.users.findOne({
                attributes: ["user_id", "email", "username", "is_deleted"],
                where: {
                    email: email,
                    is_deleted: 0
                }
            });
            userData = JSON.parse(JSON.stringify(userData));
            if (userData) {
                ApiError.handle(new BadRequestError("Email address already registered."), res);
            } else {

                let userNameData = await dbReader.users.findOne({
                    attributes: ["user_id", "email", "username", "is_deleted"],
                    where: {
                        username: username,
                        is_deleted: 0
                    }
                });
                userNameData = JSON.parse(JSON.stringify(userNameData));
                if (userNameData) {
                    ApiError.handle(new BadRequestError("Username already registered."), res);
                } else {
                    password = crypto.encrypt(password.toString(), true).toString();
                    let email_otp = await generateRandomNo(6).toString(),
                        sms_otp = "123456"//await generateRandomNo(6).toString();

                    await dbWriter.users.create({
                        name: name,
                        username: username,
                        email: email,
                        contact: contact,
                        password: password,
                        google_signup: google_signup,
                        latitude: latitude,
                        longitude: longitude,
                        role: role,
                        photo: photo,
                        address: address,
                        city: city,
                        state: state,
                        country: country,
                        experience: experience,
                        email_otp: email_otp,
                        sms_otp: sms_otp
                    });

                    let payload = {
                        email: email,
                        email_otp,
                        templateIdentifier: EnumObject.templateIdentifier.get('registerEmailOTP').value,
                    }
                    await ObjectMail.ConvertData(payload, function (data) { });

                    //Need to delevop the sms otp send flow here. this is pending as client confirmation is pending

                    res.send({
                        status_code: 200,
                        message: "User register successfully."
                    });
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    login = async (req, res) => {
        try {
            let { email, password } = req.body
            password = crypto.encrypt(password.toString(), true).toString();
            let userExistData = await dbReader.users.findOne({
                // attributes: ["user_id", "first_name", "last_name", "password", "email", "created_at", "status"],
                where: {
                    email: email,
                    is_deleted: 0
                }
            })
            userExistData = JSON.parse(JSON.stringify(userExistData))
            if (!userExistData) {
                ApiError.handle(new BadRequestError("Invalid email or password."), res);
            } else {
                if (userExistData?.is_email_verified && userExistData?.is_sms_verified) {
                    if (userExistData.password == password) {
                        let UA_string = req.headers['user-agent'];
                        const UA = new UAParser(UA_string);
                        let userData = {
                            user_id: userExistData.user_id,
                            role: userExistData.user_id,
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
                            device_info: JSON.stringify(userAgent),
                            platform: platform,
                            device_token: device_token,
                            created_at: new Date()
                        })
                        let responseData = {
                            name: userExistData.name,
                            email: userExistData.email,
                            username: userExistData.username,
                            role: userExistData.role,
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
                        ApiError.handle(new BadRequestError("Invalid email or password."), res);
                    }
                } else {
                    throw new Error("User not veryfied.");
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    logOut = async (req, res) => {
        try {
            let { token } = req.body;
            let { user_id } = req;
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

    validateOTP = async (req, res) => {
        try {
            let { email, otp, type } = req.body;
            let data = await dbReader.users.findOne({
                attributes: ["user_id", "email", "email_otp", "sms_otp"],
                where: { email: email }
            });
            data = JSON.parse(JSON.stringify(data));

            if (data) {
                let verify = 0;

                if (type === "email") {
                    if (data?.email_otp === otp.toString()) {
                        verify = 1;
                    }
                } else {
                    if (data?.sms_otp === otp.toString()) {
                        verify = 1;
                    }
                }
                if (verify === 1) {
                    await dbWriter.users.update({
                        is_email_verified: (type === "email") ? 1 : 0,
                        is_sms_verified: (type === "sms") ? 1 : 0
                    }, {
                        where: { user_id: ExistUser.user_id }
                    });
                    return new SuccessResponse("OTP verified successfully.", {}).send(res);
                } else {
                    throw new Error("Invalid OTP.");
                }

            } else {
                throw new Error("Invalid user details.");
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    forgotPassword = async (req, res) => {
        try {
            let { email } = req.body;
            let ExistUser = await dbReader.users.findOne({
                where: {
                    email: email
                }
            })
            ExistUser = JSON.parse(JSON.stringify(ExistUser));
            if (ExistUser) {
                let email_otp = await generateRandomNo(6).toString();

                let payload = {
                    user_id: ExistUser.user_id,
                    email: ExistUser.email,
                    first_name: ExistUser.first_name,
                    email_otp: email_otp,
                    templateIdentifier: EnumObject.templateIdentifier.get('forgotPassword').value,
                };

                await dbWriter.users.update({
                    email_otp: email_otp
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
                ApiError.handle(new BadRequestError("User does not exist"), res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    forgotPasswordOTPCheck = async (req, res) => {
        try {
            let { email, otp } = req.body;
            let data = await dbReader.users.findOne({
                attributes: ["user_id", "email", "email_otp"],
                where: { email: email }
            });
            data = JSON.parse(JSON.stringify(data));

            if (data) {
                if (data?.email_otp === otp.toString()) {
                    return new SuccessResponse("OTP verified successfully.", { otp_verified: true }).send(res);
                } else {
                    throw new Error("Invalid OTP.");
                }
            } else {
                throw new Error("Invalid user details.");
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    resetUserPassword = async (req, res) => {
        try {
            let { email, confirmPassword, newPassword } = req.body;
            let { user_id } = req;

            let ExistUser = await dbReader.users.findOne({
                where: {
                    email: email
                }
            })
            ExistUser = JSON.parse(JSON.stringify(ExistUser))
            if (ExistUser) {
                if (newPassword === confirmPassword) {
                    newPassword = crypto.encrypt(newPassword.toString(), true).toString();
                    await dbWriter.users.update({
                        password: newPassword
                    }, {
                        where: {
                            email: email
                        }
                    })
                    new SuccessResponse("Password changed successfully.", {}).send(res);
                } else {
                    ApiError.handle(new BadRequestError("Password is not matching."), res);
                }
                // res.send({
                //     status_code: 200,
                //     message: "Logout successfully.",
                // })
            } else {
                ApiError.handle(new BadRequestError("Email Does not exist."), res);
            }

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    resendEmailOTP = async (req, res) => {
        try {
            let { email } = req.body;

            let ExistUser = await dbReader.users.findOne({
                where: {
                    email: email
                }
            })
            ExistUser = JSON.parse(JSON.stringify(ExistUser))
            if (ExistUser) {
                let email_otp = await generateRandomNo(6).toString();
                await dbWriter.users.update({
                    email_otp: email_otp
                }, {
                    where: {
                        email: email,
                    }
                });

                let payload = {
                    user_id: ExistUser.user_id,
                    email: ExistUser.email,
                    first_name: ExistUser.first_name,
                    email_otp: email_otp,
                    templateIdentifier: EnumObject.templateIdentifier.get('registerEmailOTP').value,
                };
                await ObjectMail.ConvertData(payload, function (data) { });

                new SuccessResponse("OTP send successfully.", {}).send(res);
            } else {
                ApiError.handle(new BadRequestError("User does not exist."), res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    resendSMSOTP = async (req, res) => {
        try {
            let { email, contact } = req.body;

            let ExistUser = await dbReader.users.findOne({
                where: {
                    email: email
                }
            });
            ExistUser = JSON.parse(JSON.stringify(ExistUser))
            if (ExistUser) {
                let sms_otp = await generateRandomNo(6).toString();
                await dbWriter.users.update({
                    sms_otp: sms_otp
                }, {
                    where: {
                        email: email,
                    }
                })
                new SuccessResponse("OTP send successfully.", {}).send(res);
            } else {
                ApiError.handle(new BadRequestError("User does not exist."), res);
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