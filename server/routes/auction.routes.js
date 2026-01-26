const router = require("express").Router();
const auctionController = require("../controllers/auction.controller.js");
const auth = require("../middleware/auth.middleware.js");

router.post("/create", auth, auctionController.createAuction);
router.get("/active", auctionController.getActive);
router.get("/:id", auctionController.getOne);

module.exports = router;
