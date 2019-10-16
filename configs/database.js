var debug = require("debug")("caro-back:server");
var mongoose = require("mongoose");

//database setup
mongoose.connect("mongodb://wi1205:wi1205@ds335668.mlab.com:35668/caro", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var database = mongoose.connection;

database.on("error", console.error.bind(console, "connection error:"));
database.once("open", function() {
  debug("Sucessfully connect to database: Mongodb");
});
