const app = require("./app/app.js");
const mongoose = require("mongoose");

var Admin = require("./app/models/account").Admin;
var Account = require("./app/models/account").Account;

Account.remove()
  .then(() => {
    var admin = new Admin({
      email: "admin@admin.com",
      password: "admin",
      name: "admin",
      surname: "admin",
    });
    return admin.save();
  })
  .then(() => {
    console.log("User admin saved successfully");
  });

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
