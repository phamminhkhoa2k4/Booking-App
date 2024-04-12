const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const imageDownloader = require('image-downloader')
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const bcryptSalt = bcrypt.genSaltSync(10);
const cookieParser = require("cookie-parser");
const jwtSecret = "fof0md74hj4h5yi4jk";
app.use('/uploads', express.static(__dirname+ '/uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const isEmailExist = await User.findOne({email});
  if (!isEmailExist){
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    })
      .then(() => {
        res.json({ statusCode: 0, msg: "Register Successfully !!!"  });
      })
      .catch((e) => {
        res.json({ statusCode: 2, msg:e });
      });
    }else{
      res.json({ statusCode: 1, msg: "Email Already Exists !!!" });
    }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email })
    .then((user) => {
      if (user) {
        const isPassword = bcrypt.compareSync(password, user.password);
        if (isPassword) {
          jwt.sign(
            { email: user.email, id: user._id, name: user.name },
            jwtSecret,
            {},
            (err, token) => {
              if (err) throw err;
              res.cookie("token", token).json({ statusCode: 0, data: user,msg:"Login Successfully !!!" });
            }
          );
        } else {
          res.json({ statusCode: 1, msg: "Password Not Matching !!!" });
        }
      } else {
        res.json({ statusCode: 2, msg: "Email Does Not Exist !!! " });
      }
    })
    .catch((e) => {
      res.status(400).json({ statusCode: 3, msg: e });
    });
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) throw err;
      await User.findById(user.id).then(({ name, email, _id }) => {
        res.json({ name, email, _id });
      });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout",(req,res) => {
  res.cookie('token',"").json(true);
});

app.post('/upload-by-link',async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName
  });
  res.json(newName);
})
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
