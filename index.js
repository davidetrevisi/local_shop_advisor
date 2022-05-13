const app = require('./app/app.js');
const mongoose = require('mongoose');
app.locals.db = mongoose.connect(process.env.DB_URL,
{useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
console.log("Connected to Database");
app.listen(8080, () => { console.log(`Server listening`) });
});
