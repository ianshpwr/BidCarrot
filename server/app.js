const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes.js");
const auctionRoutes = require("./routes/auction.routes.js");
const bidRoutes = require("./routes/bid.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/auctions", auctionRoutes);
app.use("/bids", bidRoutes);

module.exports = app;
