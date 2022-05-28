const app = require("./app/app.js");
const mongoose = require("mongoose");

var Address = require("./app/models/account").Address;
var Admin = require("./app/models/account").Admin;
var Account = require("./app/models/account").Account;



app.locals.db = mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
    app.listen(8080, () => {
      console.log(`Server listening`);
    });
  });
