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
                }
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
                    is_deleted:0
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
                    notification_id:notification_id,
                    is_deleted:0
                }
            })
            new SuccessResponse("Request successful.", {}).send(res);

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

}

module.exports = NotificationController;