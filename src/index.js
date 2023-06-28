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
app.use(cors({ origin: "http://localhost:4000", credentials: true }));
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

app.use((err, req, res, next) => {
  res.json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server berhasil di running di port ${PORT}`);
});
