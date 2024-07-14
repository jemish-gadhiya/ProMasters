const HandymanController = require('../controllers/handymanController');
const validator = require("../helpers/validator");
const tokenValidate = require('../middleware/tokenValidate');
const { jois } = require('../middleware/handymanValidation');

class HandymanRoute extends HandymanController {
    constructor(router) {
        super();
        this.route(router);
    }
    route(router) {

        //Service address related API's
        router.post("/addHandyman", tokenValidate, validator(jois.addHandymansPayload), this.addHandyman);
        router.post("/editHandyman", tokenValidate, validator(jois.editHandymansPayload), this.editHandyman);
        router.get("/getAllHandymanByPovider", tokenValidate, this.getAllHandymanByPovider);
        router.post("/activateDeactivateHandyman", tokenValidate, validator(jois.activateDeactivateHandymanPayload), this.activateDeactivateHandyman);
        router.get("/getCompletedServiceCountForHandyman", tokenValidate, this.getCompletedServiceCountForHandyman);
    }
}

module.exports = HandymanRoute;