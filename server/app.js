const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes.js");
const auctionRoutes = require("./routes/auction.routes.js");
const bidRoutes = require("./routes/bid.routes.js");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3001",
    "https://bidcarrot.vercel.app",
    "https://bidcarrot.onrender.com",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.use(express.json());
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.status(200).send({ message: "BidCarrot API is active" });
});

app.use("/auth", authRoutes);
app.use("/auctions", auctionRoutes);
app.use("/bids", bidRoutes);

module.exports = app;