const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const Place = require("./models/Place");
const PORT = process.env.PORT || 3000;
const bcryptSalt = bcrypt.genSaltSync(10);
const cookieParser = require("cookie-parser");
const jwtSecret = "fof0md74hj4h5yi4jk";
app.use("/uploads", express.static(__dirname + "/uploads"));
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
  const isEmailExist = await User.findOne({ email });
  if (!isEmailExist) {
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    })
      .then(() => {
        res.json({ statusCode: 0, msg: "Register Successfully !!!" });
      })
      .catch((e) => {
        res.json({ statusCode: 2, msg: e });
      });
  } else {
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
              res.cookie("token", token).json({
                statusCode: 0,
                data: user,
                msg: "Login Successfully !!!",
              });
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

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/uploads", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadFiles.push(newPath.replace("uploads", ""));
  }
  res.json(uploadFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) throw err;
      await Place.create({
        owner: user.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      }).then((data) => {
        res.json({
          statusCode: 0,
          msg: "Add New Place Successfully !!!",
          data,
        });
      });
    });
  } else {
    console.log("mnnn");
    res.json([]);
  }
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) throw err;
      await Place.find({ owner: user.id }).then((data) => {
        res.json(data);
      });
    });
  } else {
    res.json(null);
  }
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  await Place.findById(id).then((data) => {
    res.json(data);
  });
});

app.put("/places", (req, res) => {
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      const data = await Place.findById(id);
      if (err) throw err;
      if (data.owner.toString() == user.id) {
        await Place.findByIdAndUpdate(id, {
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
        }).then((data) => {
          res.json({ statusCode: 0, msg: "Updated Successfully !!!", data });
        });
      }
    });
  } else {
    res.json(null);
  }
});

app.get("/places", async (req,res) => {
  await Place.find().then((data) => {
    res.json(data);
  })
})

app.get("/place/:id", async (req,res) => {
  const { id } = req.params;
  await Place.findById(id).then((data) => {
    res.json(data);
  })
})
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
