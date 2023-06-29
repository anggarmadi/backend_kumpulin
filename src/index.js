require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const indexRouter = require("./routes/index");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users");
const formsRouter = require("./routes/forms");
const submissionsRouter = require("./routes/submission");
const authRouter = require("./routes/auth");
const { authenticateToken } = require("./middleware/verifyToken");
const PORT = process.env.PORT || 3000;
var User = require("./models/users");

// const usersRoutes = require("./routes/users");

// const middlewareLogRequest = require("./middleware/logs");
// const upload = require("./middleware/multer");

const app = express();

app.use(
  session({
    secret: "some-scret",
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   sameSite: "none",
    //   secure: true,
    // },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: "https://kumpulin.website",
//     credentials: true,
//   })
// );
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/home", indexRouter);
app.use("/users", usersRouter);
app.use("/forms", formsRouter);
app.use("/submissions", submissionsRouter);
app.use("/auth", authRouter);
// app.use(middlewareLogRequest);
// app.use(express.json());
// app.use("/assets", express.static("public/images"));

// app.use("/users", usersRoutes);
// app.post("/upload", upload.single("photo"), (req, res) => {
//   res.json({
//     message: "Upload berhasil",
//   });
// });

app.get("/download/:fileName", authenticateToken, function (req, res) {
  const fileName = req.params.fileName;
  const filePath = __dirname + "/assets/files_upload/" + fileName;

  console.log(filePath);

  res.download(filePath, function (err) {
    if (err) {
      // Tangani kesalahan jika terjadi
      console.log(err);
      res.status(404).send("File tidak ditemukan");
    }
  });
});

// Definisikan endpoint untuk mengirimkan gambar avatar
app.get("/avatar", async (req, res) => {
  const user_id = req.session.user_id;
  // Ambil path file gambar avatar dari database
  // const avatarPath = getGambarPath(user_id); // Ganti dengan path yang sesuai di database
  // console.log("Ada? : ", avatarPath);

  const gambar = await User.findOne({ where: { user_id: user_id } });

  // Periksa apakah gambar ditemukan
  if (!gambar) {
    throw new Error("Gambar tidak ditemukan");
  }

  // Ambil path gambar dari objek Sequelize
  const imagePath = gambar.avatar;

  // Periksa apakah file gambar ada
  if (fs.existsSync(imagePath)) {
    // Set header tipe konten sebagai gambar
    res.setHeader("Content-Type", "image/jpeg"); // Ganti dengan tipe konten yang sesuai

    // Baca file gambar dan kirimkan sebagai respons
    fs.createReadStream(imagePath).pipe(res);
  } else {
    res.status(404).send("Gambar avatar tidak ditemukan");
  }
});

app.use((err, req, res, next) => {
  res.json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server berhasil di running di port ${PORT}`);
});
