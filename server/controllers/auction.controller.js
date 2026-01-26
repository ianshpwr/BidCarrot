const auctionService = require("../services/auction.service.js");

exports.createAuction = async (req, res) => {
  const response = await auctionService.create(req.user.id, req.body);
  res.json(response);
};

exports.getActive = async (req, res) => {
  const data = await auctionService.getActive();
  res.json(data);
};

exports.getOne = async (req, res) => {
  const id = req.params.id;
  const data = await auctionService.getOne(id);
  res.json(data);
};
