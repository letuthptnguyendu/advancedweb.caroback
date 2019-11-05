var httpErrors = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var cors = require("cors");
const passport = require("passport");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
var authRouter = require("./routes/auth");
var gameRouter = require("./routes/game");
var app = express();

const { SESSION_SECRET } = require("./configs/key");

// connect database
require("./configs/database");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// session and passport
app.use(
  session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

require("./configs/body_parser")(app);
require("./configs/passport");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/auth", authRouter);
app.use("/game", gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(httpErrors(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
