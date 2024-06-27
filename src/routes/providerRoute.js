const ProviderController = require('../controllers/providerController');
const validator = require("../helpers/validator");
const tokenValidate = require('../middleware/tokenValidate');
const { jois } = require('../middleware/providerValidation');

class ProviderRoute extends ProviderController {
    constructor(router) {
        super();
        this.route(router);
    }
    route(router) {
        router.post("/addEditServiceAddress", tokenValidate, validator(jois.addEditServiceAddressPayload), this.addEditServiceAddress);
        router.get("/getAllServiceAddress", tokenValidate, this.getAllServiceAddress);
        router.get("/getActiveServiceAddress", tokenValidate, this.getActiveServiceAddress);
        router.post("/deleteServiceAddress", tokenValidate, validator(jois.deleteServiceAddressPayload), this.deleteServiceAddress);
        router.post("/dactiveServiceAddress", tokenValidate, validator(jois.dactiveServiceAddressPayload), this.dactiveServiceAddress);
    }
}

module.exports = ProviderRoute;