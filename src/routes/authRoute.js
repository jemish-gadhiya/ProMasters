const AuthController = require('../controllers/authController');
const validator = require("../helpers/validator");
const tokenValidate = require('../middleware/tokenValidate');
const { upload } = require('../helpers/helpers');
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
        router.post("/fileUpload", upload.array('files'), this.fileUpload);
        router.post("/frontEndErrorLog", this.frontEndErrorLog);
        router.get("/getUserDetail", tokenValidate , this.getUserDetail);
        
        //Manage tax from admin panel
        router.post("/addEditServiceTax", tokenValidate, validator(jois.addEditServiceTaxPayload), this.addEditServiceTax);
        router.get("/getAllServiceTax", tokenValidate, this.getAllServiceTax);
        router.post("/deleteServiceTax", tokenValidate, validator(jois.deleteServiceTaxPayload), this.deleteServiceTax);


        //Manage comission from admin panel
        router.post("/addEditComission", tokenValidate, validator(jois.addEditComissionPayload), this.addEditComission);
        router.get("/getAllComission", tokenValidate, this.getAllComission);
        router.post("/deleteComission", tokenValidate, validator(jois.deleteComissionPayload), this.deleteComission);


        //manage the providers fro the admin panel
        router.get("/listAllProviders", tokenValidate, this.listAllProviders);
        router.post("/addEditProviderComission", tokenValidate, validator(jois.addEditProviderComissionPayload), this.addEditProviderComission);

    }
}

module.exports = AuthRoute;