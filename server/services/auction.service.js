const prisma = require("../utils/prisma.util.js");

exports.create = async (sellerId, data) => {
  const endTime = new Date(Date.now() + data.durationMs);

  const auction = await prisma.auction.create({
    data: {
      ...data,
      sellerId,
      endTime,
      highestBid: data.basePrice
    }
  });

  return auction;
};

exports.getActive = async () => {
  return prisma.auction.findMany({
    where: { status: "ACTIVE" },
    include: { bids: true }
  });
};

exports.getOne = async (id) => {
  return prisma.auction.findUnique({
    where: { id },
    include: { bids: true }
  });
};