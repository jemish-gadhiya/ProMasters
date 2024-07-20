const RatingController = require('../controllers/ratingController');
const validator = require("../helpers/validator");
const tokenValidate = require('../middleware/tokenValidate');

class RatingRoute extends RatingController {
    constructor(router) {
        super();
        this.route(router);
    }
    route(router) {
        //Service address related API's
        router.post("/saveRating", tokenValidate, this.saveRating);
        router.post("/listRatingForService", tokenValidate, this.listRatingForService);
        router.post("/deleteRating", tokenValidate, this.deleteRating);
        router.post("/editRating", tokenValidate, this.editRating);
        router.get("/listRatingForUserRatedService", tokenValidate, this.listRatingForUserRatedService);

        router.post("/saveFavouriteService", tokenValidate, this.saveFavouriteService);
        router.get("/listFavouriteService", tokenValidate, this.listFavouriteService);

    }
}

module.exports = RatingRoute;