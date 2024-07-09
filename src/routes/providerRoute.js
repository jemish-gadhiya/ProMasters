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

        //Service address related API's
        router.post("/addEditServiceAddress", tokenValidate, validator(jois.addEditServiceAddressPayload), this.addEditServiceAddress);
        router.get("/getAllServiceAddress", tokenValidate, this.getAllServiceAddress);
        router.get("/getActiveServiceAddress", tokenValidate, this.getActiveServiceAddress);
        router.post("/deleteServiceAddress", tokenValidate, validator(jois.deleteServiceAddressPayload), this.deleteServiceAddress);
        router.post("/deactiveServiceAddress", tokenValidate, validator(jois.deactiveServiceAddressPayload), this.deactiveServiceAddress);

        //Category related API's
        router.post("/addEditCategory", tokenValidate, validator(jois.addEditCategoryPayload), this.addEditCategory);
        router.get("/getAllCategory", tokenValidate, this.getAllCategory);
        router.get("/getActiveCategory", tokenValidate, this.getActiveCategory);
        router.post("/deleteCategory", tokenValidate, validator(jois.deleteCategoryPayload), this.deleteCategory);
        router.post("/deactiveCategory", tokenValidate, validator(jois.deactiveCategoryPayload), this.deactiveCategory);


       router.post("/addEditService", tokenValidate,  this.addEditService);
        router.post("/deleteService", tokenValidate,  this.deleteService);
        router.post("/getServiceByCategory", tokenValidate,  this.getServiceByCategory);
        router.post("/getServiceById", tokenValidate,  this.getServiceById);
        router.get("/listServiceForProvider", tokenValidate,  this.listServiceForProvider);
        router.post("/listServiceForUser", tokenValidate,  this.listServiceForUser);
        router.post("/addServiceBooking", tokenValidate,  this.addServiceBooking);
        router.post("/saveUserAvailibility", tokenValidate,  this.saveUserAvailibility);
        router.post("/assignServiceHandyman", tokenValidate,  this.assignServiceHandyman);

        router.get("/listServiceBookingForProvider", tokenValidate,  this.listServiceBookingForProvider);
        router.post("/updateServiceBookingStatus", tokenValidate,  this.updateServiceBookingStatus);
        router.get("/listProviderForFilter", tokenValidate,  this.listProviderForFilter);

        




    }
}

module.exports = ProviderRoute;
