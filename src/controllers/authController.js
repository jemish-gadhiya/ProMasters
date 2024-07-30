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
const { Op } = dbReader.Sequelize;
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

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
class AuthController {

    getUserData = async (user_id) => {
        let userExistData = await dbReader.users.findOne({
            attributes: ["user_id", "name", "username", "email", "contact", "email", "role", "photo", "address", "city", "state", "country", "experience", "is_email_verified", "is_sms_verified", "is_active", "created_at"],
            where: {
                user_id: user_id,
                is_deleted: 0
            }
        });
        userExistData = JSON.parse(JSON.stringify(userExistData));

        return userExistData;
    }

    register = async (req, res) => {
        try {
            let { name, username, email, contact, password, google_signup = "", latitude = "", longitude = "", role, photo = "", address = "", city = "", state = "", country = "", experience = "" } = req.body;
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
                    let email_otp = generateRandomNo(6).toString(),
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
                        email_otp: email_otp,
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
            let { email, password, role, platform, device_token, device_info } = req.body;
            var encryptedPassword = crypto.encrypt(password.toString(), true).toString();

            let userExistData = await dbReader.users.findOne({
                // attributes: ["user_id", "first_name", "last_name", "password", "email", "created_at", "status"],
                where: {
                    email: email,
                    role: role,
                    is_deleted: 0
                }
            })
            userExistData = JSON.parse(JSON.stringify(userExistData));
            if (!userExistData) {
                ApiError.handle(new BadRequestError("Invalid email or password."), res);
            } else {
                if (userExistData?.is_active === 0) {
                    throw new Error("User is deactivated.");
                } else {
                    if (userExistData?.is_email_verified) {
                        if (userExistData.password == encryptedPassword) {
                            let UA_string = req.headers['user-agent'];
                            const UA = new UAParser(UA_string);
                            let userData = {
                                user_id: userExistData.user_id,
                                role: userExistData.role,
                            };
                            // let userAgent = {
                            //     browser_name: UA.getBrowser().name,
                            //     browser_version: UA.getBrowser().version,
                            //     engine_name: UA.getEngine().name,
                            //     engine_version: UA.getEngine().version,
                            //     os: UA.getOS().name,
                            //     os_ver: UA.getOS().version,
                            //     cpu: UA.getCPU().architecture,
                            //     ua: UA.getUA()
                            // }
                            let access_token = jwt.sign(userData, process.env.SECRET_KEY, {
                                // expiresIn: '24h' // expires in 24 hours
                            });

                            await dbWriter.usersLoginLogs.create({
                                user_id: userExistData.user_id,
                                access_token: access_token,
                                device_info: JSON.stringify(device_info),
                                platform: platform,
                                device_token: device_token,
                                created_at: new Date()
                            });

                            let responseData = await this.getUserData(userExistData.user_id);
                            res.send({
                                status_code: 200,
                                message: "Login successfully.",
                                token: access_token,
                                data: responseData
                            });
                        } else {
                            throw new Error("Invalid email or password.");
                        }
                    } else {
                        res.send({
                            status_code: 400,
                            message: "User not verified",
                            data: {
                                is_email_verified: userExistData?.is_email_verified,
                                is_sms_verified: userExistData?.is_sms_verified,
                            }
                        });
                    }
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
            let { email, otp, type, device_info, platform, device_token } = req.body;
            let data = await dbReader.users.findOne({
                attributes: ["user_id", "email", "email_otp", "sms_otp", "name", "username", "role", "created_at", "is_email_verified", "is_sms_verified"],
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

                let is_email_verified = data.is_email_verified, is_sms_verified = data.is_sms_verified, email_otp = data.email_otp, sms_otp = data.sms_otp;
                if (type === "email") {
                    is_email_verified = 1;
                    email_otp = "";
                } else {
                    is_sms_verified = 1;
                    sms_otp = "";
                }

                if (verify === 1) {
                    await dbWriter.users.update({
                        email_otp: email_otp,
                        sms_otp: sms_otp,
                        is_email_verified: is_email_verified,
                        is_sms_verified: is_sms_verified
                    }, {
                        where: { user_id: data.user_id }
                    });

                    if (is_email_verified === 1 && is_sms_verified === 1) {
                        let userData = {
                            user_id: data.user_id,
                            role: data.role,
                        };
                        let access_token = jwt.sign(userData, process.env.SECRET_KEY, {
                            // expiresIn: '24h' // expires in 24 hours
                        });

                        await dbWriter.usersLoginLogs.create({
                            user_id: data.user_id,
                            access_token: access_token,
                            device_info: JSON.stringify(device_info),
                            platform: platform,
                            device_token: device_token,
                            created_at: new Date()
                        })
                        let responseData = await this.getUserData(data.user_id);

                        return new SuccessResponse("OTP verified successfully.", { data: responseData, token: access_token }).send(res);
                    } else {
                        return new SuccessResponse("OTP verified successfully.", { data: data }).send(res);
                    }
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
                new SuccessResponse("Reset password OTP has been sent to your email address", {}).send(res);
            } else {
                ApiError.handle(new BadRequestError("User does not exist"), res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    forgotPasswordOTPCheck = async (req, res) => {
        try {
            let { email, otp, device_info, platform, device_token } = req.body;
            let data = await dbReader.users.findOne({
                attributes: ["user_id", "email", "email_otp", "name", "username", "role", "created_at"],
                where: { email: email }
            });
            data = JSON.parse(JSON.stringify(data));

            if (data) {
                if (data?.email_otp === otp.toString()) {
                    await dbWriter.users.update({
                        email_otp: ""
                    }, {
                        where: { user_id: data.user_id }
                    });

                    let userData = {
                        user_id: data.user_id,
                        role: data.role,
                    };
                    let access_token = jwt.sign(userData, process.env.SECRET_KEY, {
                        // expiresIn: '24h' // expires in 24 hours
                    });

                    await dbWriter.usersLoginLogs.create({
                        user_id: data.user_id,
                        access_token: access_token,
                        device_info: JSON.stringify(device_info),
                        platform: platform,
                        device_token: device_token,
                        created_at: new Date()
                    });

                    let responseData = await this.getUserData(data.user_id);

                    return new SuccessResponse("OTP verified successfully.", {
                        otp_verified: true,
                        data: responseData,
                        token: access_token
                    }).send(res);
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
                    throw new Error("Password is not matching.");
                }
            } else {
                throw new Error("Email Does not exist.");
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
                throw new Error("Email does not exist.");
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

                //Need to develop the OTP send in sms flow here

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

    fileUpload = async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).send('No files were uploaded.');
            }
            const filePaths = req.files.map(file => file.path.replace(/^uploads\\/i, '').replace(/^uploads\//i, ''));

            new SuccessResponse("File uploaded succesfully.", { files: filePaths }).send(res);
        } catch (e) {
            console.log("Error  is:: ", e)
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
    getUserDetail = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            let userData = await dbReader.users.findOne({
                attributes: ["user_id", "name", "username", "email", "contact", "email", "role", "photo", "address", "city", "state", "country", "experience", "is_email_verified", "is_sms_verified", "is_active", "created_at"],
                where: {
                    user_id: user_id,
                    is_deleted: 0
                },
            });
            userData = JSON.parse(JSON.stringify(userData));
            new SuccessResponse("Get user detail successfully.", {
                ...userData
            }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    updateUserDetail = async (req, res) => {
        try {
            let { name, username, email, contact, city, state, country, address, photo } = req.body
            // password = crypto.encrypt(password.toString(), true).toString();
            let {
                user_id,
                role
            } = req;

            let userData = await dbReader.users.findOne({
                where: {
                    user_id: user_id
                }
            });
            userData = JSON.parse(JSON.stringify(userData));
            if (userData) {
                if (userData.email !== email) {
                    let emailMatch = await dbReader.users.findOne({
                        where: {
                            email: email
                        }
                    })
                    emailMatch = JSON.parse(JSON.stringify(emailMatch))
                    if (emailMatch) {
                        throw new Error("Email is already exist in system");
                    }
                }

                if (userData.username !== username) {
                    let userNameMatch = await dbReader.users.findOne({
                        where: {
                            username: username
                        }
                    });
                    userNameMatch = JSON.parse(JSON.stringify(userNameMatch));
                    if (userNameMatch) {
                        throw new Error("Username is already exist in system");
                    }
                }

                await dbWriter.users.update({
                    name: name,
                    username: username,
                    email: email,
                    // password: password,
                    contact: contact,
                    city: city,
                    state: state,
                    country: country,
                    address: address,
                    photo: photo
                }, {
                    where: {
                        user_id: user_id
                    }
                });

                new SuccessResponse("User details updated successfully.", {
                }).send(res);
            } else {
                throw new Error("User data not found.");
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }


    //Manage tax details from admin panel 
    addEditServiceTax = async (req, res) => {
        try {
            let { tax_id = 0, tax_name = "", tax_amount = 0, tax_amount_type = 1, } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                if (tax_id === 0) {
                    await dbWriter.tax.create({
                        user_id: user_id,
                        tax_name: tax_name,
                        tax_amount: tax_amount,
                        tax_amount_type: tax_amount_type
                    });

                    new SuccessResponse("Tax data added successfully.", {}).send(res);
                } else {
                    let taxData = await dbReader.tax.findOne({
                        where: {
                            tax_id: tax_id,
                            is_deleted: 0
                        }
                    });
                    taxData = JSON.parse(JSON.stringify(taxData));
                    if (!taxData) {
                        throw new Error("Tax data not found.");
                    } else {
                        await dbWriter.tax.update({
                            tax_name: tax_name,
                            tax_amount: tax_amount,
                            tax_amount_type: tax_amount_type
                        }, {
                            where: { tax_id: tax_id }
                        });

                        new SuccessResponse("Tax data updated successfully.", {}).send(res);
                    }
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getAllServiceTax = async (req, res) => {
        try {
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let taxData = await dbReader.tax.findAll({
                    where: {
                        user_id: user_id,
                        is_deleted: 0
                    }
                });
                taxData = JSON.parse(JSON.stringify(taxData));
                new SuccessResponse("Tax data get successfully.", { data: taxData }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getServiceTaxById = async (req, res) => {
        try {
            let { tax_id } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let taxData = await dbReader.tax.findOne({
                    where: {
                        tax_id: tax_id,
                        user_id: user_id,
                        is_deleted: 0
                    }
                });
                // taxData = JSON.parse(JSON.stringify(taxData));
                new SuccessResponse("Tax data get successfully.", { data: taxData }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deleteServiceTax = async (req, res) => {
        try {
            let { tax_id } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let taxData = await dbReader.tax.findOne({
                    where: {
                        tax_id: tax_id,
                        is_deleted: 0
                    }
                });
                taxData = JSON.parse(JSON.stringify(taxData));
                if (!taxData) {
                    throw new Error("Tax data not found.");
                } else {
                    await dbWriter.tax.update({
                        is_deleted: 1
                    }, {
                        where: { tax_id: tax_id }
                    });

                    new SuccessResponse("Tax data deleted successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    activateServiceTax = async (req, res) => {
        try {
            let { tax_id } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let taxData = await dbReader.tax.findOne({
                    where: {
                        tax_id: tax_id,
                        is_deleted: 0
                    }
                });
                taxData = JSON.parse(JSON.stringify(taxData));
                if (!taxData) {
                    throw new Error("Tax data not found.");
                } else {

                    await dbWriter.tax.update({
                        is_active: 0
                    }, {
                        where: { tax_id: { [Op.not]: 0 } }
                    });
                    await dbWriter.tax.update({
                        is_active: 1
                    }, {
                        where: { tax_id: tax_id }
                    });

                    new SuccessResponse("Tax data updated successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getActiveTax = async (req, res) => {
        try {
            let { user_id, role } = req;

            let taxData = await dbReader.tax.findAll({
                where: {
                    is_active: 1,
                    is_deleted: 0
                }
            });
            taxData = JSON.parse(JSON.stringify(taxData));
            new SuccessResponse("Tax data get successfully.", { data: taxData }).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }


    //Manage comission details rom admin panel 
    addEditComission = async (req, res) => {
        try {
            let { comission_id = 0, description = "", comission_amount = 0, comission_amount_type = 1, } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                if (comission_id === 0) {
                    await dbWriter.comission.create({
                        description: description,
                        comission_amount: comission_amount,
                        comission_amount_type: comission_amount_type
                    });

                    new SuccessResponse("Comission data added successfully.", {}).send(res);
                } else {
                    let comissionData = await dbReader.comission.findOne({
                        where: {
                            comission_id: comission_id,
                            is_deleted: 0
                        }
                    });
                    comissionData = JSON.parse(JSON.stringify(comissionData));
                    if (!comissionData) {
                        throw new Error("Comission data not found.");
                    } else {
                        await dbWriter.comission.update({
                            description: description,
                            comission_amount: comission_amount,
                            comission_amount_type: comission_amount_type
                        }, {
                            where: { comission_id: comission_id }
                        });

                        new SuccessResponse("Comission data updated successfully.", {}).send(res);
                    }
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getAllComission = async (req, res) => {
        try {
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let comissionData = await dbReader.comission.findAll({
                    where: {
                        is_deleted: 0
                    }
                });
                comissionData = JSON.parse(JSON.stringify(comissionData));
                new SuccessResponse("Comission data get successfully.", { data: comissionData }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getComissionById = async (req, res) => {
        try {
            let { comission_id = 0 } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let comissionData = await dbReader.comission.findOne({
                    where: {
                        comission_id: comission_id,
                        is_deleted: 0
                    }
                });
                // comissionData = JSON.parse(JSON.stringify(comissionData));
                new SuccessResponse("Comission data get successfully.", { data: comissionData }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deleteComission = async (req, res) => {
        try {
            let { comission_id } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let comissionData = await dbReader.comission.findOne({
                    where: {
                        comission_id: comission_id,
                        is_deleted: 0
                    }
                });
                comissionData = JSON.parse(JSON.stringify(comissionData));
                if (!comissionData) {
                    throw new Error("Comission data not found.");
                } else {
                    await dbWriter.comission.update({
                        is_deleted: 1
                    }, {
                        where: { comission_id: comission_id }
                    });

                    new SuccessResponse("Comission data deleted successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }


    //Manage coupen details rom admin panel 
    addEditCoupan = async (req, res) => {
        try {
            let { coupon_id = 0, coupon_code = "", coupon_amount = 0 } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                if (coupon_id === 0) {
                    await dbWriter.coupan.create({
                        coupon_code: coupon_code,
                        coupon_amount: coupon_amount
                    });

                    new SuccessResponse("Coupan data added successfully.", {}).send(res);
                } else {
                    let coupanData = await dbReader.coupan.findOne({
                        where: {
                            coupon_id: coupon_id,
                            is_deleted: 0
                        }
                    });
                    coupanData = JSON.parse(JSON.stringify(coupanData));
                    if (!coupanData) {
                        throw new Error("Comission data not found.");
                    } else {
                        await dbWriter.comission.update({
                            coupon_code: coupon_code,
                            coupon_amount: coupon_amount
                        }, {
                            where: { coupon_id: coupon_id, }
                        });

                        new SuccessResponse("Coupan data updated successfully.", {}).send(res);
                    }
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getAllCoupan = async (req, res) => {
        try {
            let { user_id, role } = req;

            let coupanData = await dbReader.coupan.findAll({
                where: {
                    is_deleted: 0
                }
            });
            coupanData = JSON.parse(JSON.stringify(coupanData));
            new SuccessResponse("Coupan data get successfully.", { data: coupanData }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getCoupanById = async (req, res) => {
        try {
            let { coupon_id = 0 } = req.body;
            let { user_id, role } = req;

            let coupanData = await dbReader.coupan.findOne({
                where: {
                    coupon_id: coupon_id,
                    is_deleted: 0
                }
            });
            coupanData = JSON.parse(JSON.stringify(coupanData));
            new SuccessResponse("Coupan data get successfully.", { data: coupanData }).send(res);
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    activeDeactiveCoupan = async (req, res) => {
        try {
            let { coupon_id } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let coupanData = await dbReader.coupan.findOne({
                    where: {
                        coupon_id: coupon_id,
                        is_deleted: 0
                    }
                });
                coupanData = JSON.parse(JSON.stringify(coupanData));
                if (!coupanData) {
                    throw new Error("Coupan data not found.");
                } else {
                    await dbWriter.coupan.update({
                        is_active: (coupanData?.is_active === 1) ? 0 : 1
                    }, {
                        where: { coupon_id: coupon_id }
                    });

                    new SuccessResponse("Coupan data updated successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    deleteCoupan = async (req, res) => {
        try {
            let { coupon_id } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let coupanData = await dbReader.coupan.findOne({
                    where: {
                        coupon_id: coupon_id,
                        is_deleted: 0
                    }
                });
                coupanData = JSON.parse(JSON.stringify(coupanData));
                if (!coupanData) {
                    throw new Error("Coupan data not found.");
                } else {
                    await dbWriter.coupan.update({
                        is_deleted: 1
                    }, {
                        where: { coupon_id: coupon_id }
                    });

                    new SuccessResponse("Coupan data deleted successfully.", {}).send(res);
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }


    //Manage providers from the admin panel
    listAllProviders = async (req, res) => {
        try {
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let providersData = await dbReader.users.findAll({
                    attributes: ["user_id", "username", "email", "contact", "email", "role", "photo", "address", "city", "state", "country", "experience", "is_active"],
                    where: {
                        role: 2,
                        is_deleted: 0
                    },
                    include: [{
                        // saperate: true,
                        required: false,
                        model: dbReader.providerComission,
                        where: {
                            is_deleted: 0
                        },
                        include: [{
                            required: false,
                            model: dbReader.comission,
                            where: {
                                is_deleted: 0
                            }
                        }]
                    }]
                });

                providersData = JSON.parse(JSON.stringify(providersData));

                new SuccessResponse("Provider data get successfully.", { data: providersData }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getProviderById = async (req, res) => {
        try {
            let { provider_id = 0 } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {

                let providersData = await dbReader.users.findOne({
                    attributes: ["user_id", "username", "email", "contact", "email", "role", "photo", "address", "city", "state", "country", "experience", "is_active"],
                    where: {
                        user_id: provider_id,
                        role: 2,
                        is_deleted: 0
                    },
                    include: [{
                        required: false,
                        // saperate: true,
                        model: dbReader.providerComission,
                        where: {
                            is_deleted: 0
                        },
                        include: [{
                            required: false,
                            model: dbReader.comission,
                            where: {
                                is_deleted: 0
                            }
                        }]
                    }, {
                        required: false,
                        // saperate: true,
                        model: dbReader.wallet,
                        where: {
                            is_deleted: 0
                        }
                    }]
                });

                providersData = JSON.parse(JSON.stringify(providersData));


                let total_payable_amount = 0, total_paid_amount = 0
                if (providersData) {
                    for (let i = 0; i < providersData?.Wallets?.length; i++) {
                        let wData = providersData?.Wallets[i];
                        if (wData?.status === 1 && wData?.is_paid_by_admin === 0) {
                            total_payable_amount = parseFloat(total_payable_amount) + parseFloat(wData?.amount)
                        }
                        if (wData?.status === 1 && wData?.is_paid_by_admin === 1) {
                            total_paid_amount = parseFloat(total_paid_amount) + parseFloat(wData?.amount)
                        }
                    }
                }

                new SuccessResponse("Provider data get successfully.", { data: providersData, total_payable_amount: parseFloat(total_payable_amount).toFixed(2), total_paid_amount: parseFloat(total_paid_amount).toFixed(2) }).send(res);
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    addEditProviderComission = async (req, res) => {
        try {
            let { comission_id = 0, provider_id = 0 } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                let comissionData = await dbReader.comission.findOne({
                    where: {
                        comission_id: comission_id,
                        is_deleted: 0
                    }
                });
                comissionData = JSON.parse(JSON.stringify(comissionData));
                if (!comissionData) {
                    throw new Error("Comission data not found.");
                } else {
                    let providerData = await dbReader.users.findOne({
                        where: {
                            user_id: provider_id,
                            is_deleted: 0
                        }
                    });
                    providerData = JSON.parse(JSON.stringify(providerData));
                    if (!providerData) {
                        throw new Error("Provider data not found.");
                    } else {
                        await dbWriter.providerComission.update({
                            is_deleted: 1
                        }, {
                            where: {
                                comission_id: comission_id,
                                provider_id: provider_id
                            }
                        });

                        await dbWriter.providerComission.create({
                            comission_id: comission_id,
                            provider_id: provider_id
                        });
                        new SuccessResponse("Provider comission data updated successfully.", {}).send(res);

                    }
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    addEditSubscriptionPlan = async (req, res) => {
        try {
            let { subscription_plan_id = 0, title, description, amount, no_service, no_handyman, no_featured_service, is_active = 1, is_deleted = 0 } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {
                if (subscription_plan_id === 0) {
                    await dbWriter.subscriptionPlan.create({
                        title: title,
                        description: description,
                        amount: amount,
                        no_service: no_service,
                        no_handyman: no_handyman,
                        no_featured_service: no_featured_service,
                        is_active: is_active,
                        is_deleted: is_deleted
                    });

                    new SuccessResponse("Subscription plan added successfully.", {}).send(res);
                } else {
                    let planData = await dbReader.subscriptionPlan.findOne({
                        where: {
                            subscription_plan_id: subscription_plan_id,
                            is_deleted: 0
                        }
                    });
                    // planData = JSON.parse(JSON.stringify(planData));
                    if (!planData) {
                        throw new Error("Subscription plan data not found.");
                    } else {
                        await dbWriter.subscriptionPlan.update({
                            title: title,
                            description: description,
                            amount: amount,
                            no_service: no_service,
                            no_handyman: no_handyman,
                            no_featured_service: no_featured_service,
                            is_active: is_active,
                            is_deleted: is_deleted
                        }, {
                            where: { subscription_plan_id: subscription_plan_id }
                        });

                        new SuccessResponse("Subscription plan data updated successfully.", {}).send(res);
                    }
                }
            }
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    getAllSubscriptionPlans = async (req, res) => {
        try {
            let { user_id, role } = req;

            let planData = await dbReader.subscriptionPlan.findAll({
                where: {
                    is_deleted: 0,
                    is_active: 1
                }
            });
            planData = JSON.parse(JSON.stringify(planData));
            new SuccessResponse("Subscription plan data get successfully.", { data: planData }).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    payToProviderFromAdmin = async (req, res) => {
        try {
            let { provider_id, amount } = req.body;
            let { user_id, role } = req;

            if (role !== 4) {
                throw new Error("User don't have permission to perform this action.");
            } else {

                let providerData = await dbReader.users.findOne({
                    attributes: ["user_id", "name", "username", "email", "contact", "email", "role", "photo", "address", "city", "state", "country", "experience", "is_email_verified", "is_sms_verified", "is_active", "created_at"],
                    where: {
                        user_id: user_id,
                        is_deleted: 0
                    }
                });
                providerData = JSON.parse(JSON.stringify(providerData));

                if (providerData.stripe_account_id && providerData.stripe_bank_account_id) {
                    //Need to develop flow here for send payment to provider once client give payment gateway information
                    let paymentData = await stripe.payouts.create({
                        amount: amount,
                        currency: 'aed',
                        destination: bankAccount.id,
                        stripe_account: bankAccount.account,
                    });

                    let data = await dbWriter.wallet.create({
                        provider_id: provider_id,
                        service_id: 0,
                        amount: amount,
                        is_paid_by_admin: 1,
                        description: JSON.stringify(paymentData)
                    });

                    new SuccessResponse("Payment done successfully.", {}).send(res);
                } else {
                    throw new Error("User's bank account is not set up.");
                }
            }
        } catch (e) {
            console.log("error is :::", e);
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }



}

module.exports = AuthController;