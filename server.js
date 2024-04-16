const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE;

try {
  mongoose.connect(uri);
  console.log("database connected");
} catch {
  console.log("database failed");
}

const usersRouter = require("./Routes/Users");
app.use("/api/users", usersRouter);

PORT = 1715;

app.listen(PORT, () => {
  console.log(`Server Running on port : ${PORT}`);
});
