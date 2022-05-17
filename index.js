const app = require("./app/app.js");
const mongoose = require("mongoose");

var Venditore = require("./app/models/account").Venditore; // get our mongoose model
var Cliente = require("./app/models/account").Cliente;
var Account = require("./app/models/account").Account;

Account.remove();
Venditore.remove();
Cliente.remove()
  .then(() => {
    var mario = new Cliente({
      email: "mario.rossi@unitn.com",
      password: "123",
      name: "Mario",
      surname: "Rossi",
      /*phone: 3000,
      "personal_address.city": "Ciao",
      "personal_address.CAP": 38000,
      "personal_address.street": "via prova",
      "personal_address.number": 1,*/
    });
    return mario.save();
  })
  .then(() => {
    console.log("User mario.rossi@unitn.com saved successfully");
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
