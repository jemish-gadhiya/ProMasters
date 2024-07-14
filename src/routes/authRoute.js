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
        router.get("/getUserDetail", tokenValidate, this.getUserDetail);
        router.post("/updateUserDetail", tokenValidate, this.updateUserDetail);

        //Manage tax from admin panel
        router.post("/addEditServiceTax", tokenValidate, validator(jois.addEditServiceTaxPayload), this.addEditServiceTax);
        router.get("/getAllServiceTax", tokenValidate, this.getAllServiceTax);
        router.post("/getServiceTaxById", tokenValidate, validator(jois.getServiceTaxByIdPayload), this.getServiceTaxById);
        router.post("/deleteServiceTax", tokenValidate, validator(jois.deleteServiceTaxPayload), this.deleteServiceTax);
        router.post("/activateServiceTax", tokenValidate, validator(jois.activateServiceTaxPayload), this.activateServiceTax);



        //Manage comission from admin panel
        router.post("/addEditComission", tokenValidate, validator(jois.addEditComissionPayload), this.addEditComission);
        router.get("/getAllComission", tokenValidate, this.getAllComission);
        router.post("/getComissionById", tokenValidate, validator(jois.getComissionByIdPayload), this.getComissionById);
        router.post("/deleteComission", tokenValidate, validator(jois.deleteComissionPayload), this.deleteComission);


        //manage the providers fro the admin panel
        router.get("/listAllProviders", tokenValidate, this.listAllProviders);
        router.post("/getProviderById", tokenValidate, validator(jois.getProviderByIdPayload), this.getProviderById);
        router.post("/addEditProviderComission", tokenValidate, validator(jois.addEditProviderComissionPayload), this.addEditProviderComission);


        //manage the providers fro the admin panel
        router.post("/addEditSubscriptionPlan", tokenValidate, validator(jois.addEditSubscriptionPlanPayload), this.addEditSubscriptionPlan);
        router.get("/getAllSubscriptionPlans", tokenValidate, this.getAllSubscriptionPlans);

        router.post("/payToProviderFromAdmin", tokenValidate, validator(jois.payToProviderFromAdminPayload), this.payToProviderFromAdmin);
    }
}

module.exports = AuthRoute;