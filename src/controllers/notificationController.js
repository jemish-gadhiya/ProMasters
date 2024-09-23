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
    generateRandomNo
} = require('../helpers/helpers');
const {
    dbReader,
    dbWriter
} = require('../models/dbconfig');
const index_1 = require("../core/index");
const nodeMailerController_1 = require("./nodeMailerController");
var crypto = new index_1.crypto_1();
const jwt = require("jsonwebtoken");
require('dotenv').config()
const enumerationController = require("./enumurationController");
var ObjectMail = new nodeMailerController_1();
var EnumObject = new enumerationController();
const admin = require('firebase-admin');
const serviceAccount = require('../../urbanclone-13a69-firebase-adminsdk-7caf5-c4a27d4921.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});



class NotificationController {

    listNotification = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;

            let notificationData = await dbReader.notification.findAll({
                where: {
                    user_id: user_id,
                    is_deleted: 0
                },
                include: [{
                    required: false,
                    model: dbReader.service,
                    where: {
                        is_deleted: 0
                    },
                    include: [{
                        required: false,
                        model: dbReader.serviceBooking,
                        where: {
                            is_deleted: 0,
                            booked_by: user_id
                        },
                    }]
                }]
            })
            notificationData = JSON.parse(JSON.stringify(notificationData))
            new SuccessResponse("Request successful.", {
                data: notificationData
            }).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    updateNotificationReadingStatus = async (req, res) => {
        try {
            let {
                is_read, // 0 = not read , 1 = read,
                notification_id
            } = req.body;
            let {
                role
            } = req;
            await dbReader.notification.update({
                is_read: is_read
            }, {
                where: {
                    notification_id: notification_id
                }
            })
            new SuccessResponse("Request successful.", {}).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    updateNotificationAllReadingStatus = async (req, res) => {
        try {
            let {
                user_id,
                role
            } = req;
            await dbReader.notification.update({
                is_read: 1
            }, {
                where: {
                    user_id: user_id,
                    is_deleted: 0
                }
            })
            new SuccessResponse("Request successful.", {}).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }
    deleteNotification = async (req, res) => {
        try {
            let {
                notification_id
            } = req.body;
            let {
                user_id,
                role
            } = req;
            await dbReader.notification.update({
                is_deleted: 1
            }, {
                where: {
                    user_id: user_id,
                    notification_id: notification_id,
                    is_deleted: 0
                }
            })
            new SuccessResponse("Request successful.", {}).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    sendPushNotification(registrationTokens, message) {
        const payload = {
            notification: {
                title: message.title,
                body: message.body,
            },
            android: {
                notification: {
                    icon: 'ProMaster', // Android-specific icon
                    color: '#f45342', // Android-specific color
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default', // iOS-specific sound
                    },
                },
            },
        };

        admin
            .messaging()
            .sendToDevice(registrationTokens, payload)
            .then((response) => {
                console.log('Successfully sent message:', response);
                if (response.failureCount > 0) {
                    const failedTokens = [];
                    response.results.forEach((result, index) => {
                        const error = result.error;
                        if (error) {
                            console.error(
                                'Failure sending notification to',
                                registrationTokens[index],
                                error
                            );
                            failedTokens.push(registrationTokens[index]);
                        }
                    });
                    console.log('List of tokens that caused failures:', failedTokens);
                }
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    };

    // sendPushNotification = (registrationToken, message) => {
    //     const payload = {
    //       notification: {
    //         title:message.title,
    //         body: message.body,
    //       },
    //     };

    //     admin
    //       .messaging()
    //       .sendToDevice(registrationToken, payload)
    //       .then((response) => {
    //         console.log('Successfully sent message:', response);
    //       })
    //       .catch((error) => {
    //         console.error('Error sending message:', error);
    //       });
    //   };
}

module.exports = NotificationController;