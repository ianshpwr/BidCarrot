require("dotenv").config();
const app = require("./app");

console.log(process.env.DATABASE_URL);
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
