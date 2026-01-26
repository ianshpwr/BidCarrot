const prisma = require("../utils/prisma.util.js");

exports.placeBid = async ({ userId, auctionId, amount }) => {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId }
  });

  if (!auction) return { error: "Auction not found" };

  if (auction.status !== "ACTIVE")
    return { error: "Auction is not active" };

  if (amount <= auction.highestBid)
    return { error: "Bid must be higher than current highest bid" };

  const bidder = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (bidder.wallet < amount)
    return { error: "Insufficient wallet balance" };

  // Deduct from new bidder
  await prisma.user.update({
    where: { id: userId },
    data: { wallet: { decrement: amount } }
  });

  // Refund previous highest bidder
  if (auction.currentHolder) {
    await prisma.user.update({
      where: { id: auction.currentHolder },
      data: { wallet: { increment: auction.highestBid } }
    });
  }

  // Save bid
  await prisma.bid.create({
    data: {
      userId,
      auctionId,
      amount
    }
  });

  // Update auction
  await prisma.auction.update({
    where: { id: auctionId },
    data: {
      highestBid: amount,
      currentHolder: userId
    }
  });

  return { message: "Bid placed successfully" };
};
