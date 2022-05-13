const mongoose = require("mongoose");

// Per usare il database in locale cambiare la stringa in .connect() con 'mongodb://localhost:27017/Test'
// Il database deve essere stato prima avviato lanciando il programma "mongod.exe"

// Test di connessione al database in remoto.

mongoose
  .connect(
    "mongodb+srv://Admin:IngegneriaDelSoftware2022@database.0gkvd.mongodb.net/Test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connesso al Database"); // Stampa di cortesia a connessione avvenuta
  });
