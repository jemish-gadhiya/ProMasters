const AuthController = require('../controllers/authController');
const validator = require("../helpers/validator");
const tokenValidate = require('../middleware/tokenValidate');
const { jois } = require('../middleware/authValidation');

class AuthRoute extends AuthController {
    constructor(router) {
        super();
        this.route(router);
    }
    route(router) {
        router.post("/login", validator(jois.loginPayload),this.login);
        router.post("/logOut",tokenValidate ,this.logOut);
        router.post("/forgotPassword",this.forgotPassword);
        router.post("/validateResetPasswordToken",this.validateResetPasswordToken);
        router.post("/resetUserPassword",this.resetUserPassword);
        router.post("/frontEndErrorLog",this.frontEndErrorLog);
    }
}

module.exports = AuthRoute