const Enum = require('enum');

/**
 *
 * @class enumerationController
 * 
 */
class enumerationController {

    templateIdentifier = new Enum({
        'registerEmailOTP': 1,
        'forgotPassword': 2,
        'welcomeEmail': 3,
    });

}
module.exports = enumerationController;
