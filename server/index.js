const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const bcryptSalt = bcrypt.genSaltSync(10);
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password: bcrypt.hashSync(password, bcryptSalt),
  })
    .then((user) => {
      res.json(user);
    })
    .catch((e) => {
      res.status(422).json(e);
    });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
