const NotificationController = require('../controllers/notificationController');
const validator = require("../helpers/validator");
const tokenValidate = require('../middleware/tokenValidate');

class NotificationRoute extends NotificationController {
    constructor(router) {
        super();
        this.route(router);
    }
    route(router) {
        //Service address related API's
        router.get("/listNotification", tokenValidate, this.listNotification);
        router.post("/updateNotificationReadingStatus", tokenValidate, this.updateNotificationReadingStatus);
        router.get("/updateNotificationAllReadingStatus", tokenValidate, this.updateNotificationAllReadingStatus);
        router.post("/deleteNotification", tokenValidate, this.deleteNotification);
    }
}

module.exports = NotificationRoute;
