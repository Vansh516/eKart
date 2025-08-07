const express = require("express");
const { connectDB } = require("./src/config/database.config");
const { error } = require("./src/middlewares/error.middlewares");
require("dotenv").config();


const userRoutes = require("./src/routes/user/user.routes");

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);

connectDB();

app.use(error);

app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  console.log("Serevr running: ", process.env.PORT);
});
