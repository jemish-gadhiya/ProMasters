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
        router.post("/login", validator(jois.loginPayload), this.login);
        router.post("/register", validator(jois.registerPayload), this.register);
        router.post("/validateOTP", validator(jois.validateOTPPayload), this.validateOTP);
        router.post("/logOut", tokenValidate, validator(jois.logoutPayload), this.logOut);
        router.post("/forgotPassword", validator(jois.forgetPasswordPayload), this.forgotPassword);
        router.post("/forgotPasswordOTPCheck", validator(jois.forgotPasswordOTPCheckPayload), this.forgotPasswordOTPCheck);
        router.post("/resetUserPassword", tokenValidate, validator(jois.resetUserPasswordPayload), this.resetUserPassword);
        router.post("/resendEmailOTP", validator(jois.resendEmailOTPPayload), this.resendEmailOTP);
        router.post("/resendSMSOTP", validator(jois.resendSMSOTPPayload), this.resendSMSOTP);
        router.post("/frontEndErrorLog", this.frontEndErrorLog);
    }
}

module.exports = AuthRoute