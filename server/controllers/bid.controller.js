const bidService = require("../services/bid.service.js");

exports.placeBid = async (req, res) => {
  const result = await bidService.placeBid({
    userId: req.user.id,
    auctionId: req.params.auctionId,
    amount: req.body.amount
  });

  res.json(result);
};
