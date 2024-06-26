const Enum = require('enum');

/**
 *
 * @class enumerationController
 * 
 */
class enumerationController {

    templateIdentifier = new Enum({
        'resetPassword': 1,
        'welcomeEmail': 2,
        'registerEmailOTP': 3
    });



}
module.exports = enumerationController;
