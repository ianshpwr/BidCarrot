const router = require("express").Router();
const bidController = require("../controllers/bid.controller.js");
const auth = require("../middleware/auth.middleware.js");

router.post("/:auctionId", auth, bidController.placeBid);

module.exports = router;
