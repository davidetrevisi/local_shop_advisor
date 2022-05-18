const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema dell'indirizzo generico: città, CAP, via, civico

const addressSchema = new Schema({
  city: {
    type: String,
    required: true,
  },
  CAP: {
    type: Number,
    minimum: 0,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    minimum: 0,
    required: true,
  },
});

// Schema dell'account generico: email, password

const accountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Schema del profilo dell'admin: Account (email, password), nome, cognome

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
});

// Schema del profilo del cliente: Account (email, password), nome, cognome, telefono
// data di nascita, indirizzo di spedizione, indirizzo di fatturazione, metodo di pagamento

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      minimum: 0,
    },
    birthdate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    shipping_address: {
      type: addressSchema,
    },
    billing_address: {
      type: addressSchema,
    },
    payment: {
      type: String,
    },
  },
  {
    //discriminatorKey: "userCliente",
  }
);

// Schema del profilo del venditore: Account (email, password), nome, cognome, telefono
// data di nascita, Indirizzo (di spedizione), Indirizzo (di fatturazione), metodo di pagamento

const sellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      minimum: 0,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    personal_address: {
      type: addressSchema,
      required: true,
    },
  },
  {
    //discriminatorKey: "userVenditore",
  }
);

// Creo i modelli degli account dagli schemi

const Account = mongoose.model("Account", accountSchema);
const Admin = Account.discriminator("Admin", adminSchema);
const Cliente = Account.discriminator("Cliente", clientSchema);
const Venditore = Account.discriminator("Venditore", sellerSchema);

// Esporto i modelli

module.exports = {
  Account,
  Admin,
  Cliente,
  Venditore,
};
