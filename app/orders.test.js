/**
 * https://www.npmjs.com/package/supertest
 */
const request = require("supertest");
const app = require("./app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("GET /api/v2/orders", () => {
  let orderSpyFindById;
  let mockOrderId = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();
  let mockCustomerId = new mongoose.Types.ObjectId();
  let mockProductId = new mongoose.Types.ObjectId();
  let mockProductId2 = new mongoose.Types.ObjectId();
  let mockSellerId = new mongoose.Types.ObjectId();
  let mockAddressId = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Order = require("./models/order").Order;
    orderSpyFindById = jest.spyOn(Order, "findById").mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        self: "/api/v2/orders/" + mockOrderId,
        id: mockOrderId,
        customerId: mockCustomerId,
        items: [
          {
            quantity: 2,
            price: 10,
            total: 20,
            productId: mockProductId,
          },
          {
            quantity: 3,
            price: 5,
            total: 15,
            productId: mockProductId2,
          },
        ],
        subTotal: 35,
        status: "Spedito",
        payment: "Carta",
        sellerId: mockSellerId,
        shipping_address: {
          _id: mockAddressId,
          city: "Trento",
          CAP: 12345,
          street: "Via Prova",
          number: 12345,
        },
      }),
    });
  });

  afterAll(async () => {
    orderSpyFindById.mockRestore();
  });

  test("GET /api/v2/orders/:id ritorna l'ordine senza token", async () => {
    return request(app)
      .get("/api/v2/orders/" + mockOrderId)
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  var token = jwt.sign(
    { email: "Cliente", account: "Cliente", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/orders/:id ritorna l'ordine con token valido", async () => {
    return request(app)
      .get("/api/v2/orders/" + mockOrderId)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200, {
        self: "/api/v2/orders/" + mockOrderId.toString(),
        id: mockOrderId.toString(),
        customerId: mockCustomerId.toString(),
        items: [
          {
            quantity: 2,
            price: 10,
            total: 20,
            productId: mockProductId.toString(),
          },
          {
            quantity: 3,
            price: 5,
            total: 15,
            productId: mockProductId2.toString(),
          },
        ],
        subTotal: 35,
        status: "Spedito",
        payment: "Carta",
        sellerId: mockSellerId.toString(),
        shipping_address: {
          _id: mockAddressId.toString(),
          city: "Trento",
          CAP: 12345,
          street: "Via Prova",
          number: 12345,
        },
      });
  });
});

describe("GET /api/v2/orders/catalog", () => {
  let orderSpyFind;
  let mockOrderId = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();
  let mockCustomerId = new mongoose.Types.ObjectId();
  let mockProductId = new mongoose.Types.ObjectId();
  let mockProductId2 = new mongoose.Types.ObjectId();
  let mockSellerId = new mongoose.Types.ObjectId();
  let mockAddressId = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Order = require("./models/order").Order;
    orderSpyFind = jest.spyOn(Order, "find").mockImplementation(() => {
      return [
        {
          self: "/api/v2/orders/" + mockOrderId,
          id: mockOrderId,
          customerId: mockCustomerId,
          items: {
            quantity: 2,
            price: 10,
            total: 20,
            productId: mockProductId,
          },
          subTotal: 35,
          status: "Spedito",
          payment: "Carta",
          sellerId: mockSellerId,
          shipping_address: mockAddressId.toString(),
        },
      ];
    });
  });

  afterAll(async () => {
    orderSpyFind.mockRestore();
  });

  test("GET /api/v2/orders/catalog/:id ritorna tutti gli ordini di un cliente senza token", async () => {
    return request(app)
      .get("/api/v2/orders/catalog/" + mockCustomerId)
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  var token = jwt.sign(
    { email: "Cliente", account: "Cliente", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/orders/catalog/:id ritorna tutti gli ordini di un cliente con token valido", async () => {
    return request(app)
      .get("/api/v2/orders/catalog/" + mockCustomerId)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200, [
        {
          self: "/api/v2/orders/" + mockOrderId.toString(),
          customerId: mockCustomerId.toString(),
          items: {
            quantity: 2,
            price: 10,
            total: 20,
            productId: mockProductId.toString(),
          },
          subTotal: 35,
          status: "Spedito",
          id: mockOrderId.toString(),
          payment: "Carta",
          sellerId: mockSellerId.toString(),
          shipping_address: mockAddressId.toString(),
        },
      ]);
  });
});

describe("GET /api/v2/orders/catalogv", () => {
  let orderSpyFind;
  let mockOrderId = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();
  let mockCustomerId = new mongoose.Types.ObjectId();
  let mockProductId = new mongoose.Types.ObjectId();
  let mockProductId2 = new mongoose.Types.ObjectId();
  let mockSellerId = new mongoose.Types.ObjectId();
  let mockAddressId = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Order = require("./models/order").Order;
    orderSpyFind = jest.spyOn(Order, "find").mockImplementation(() => {
      return [
        {
          self: "/api/v2/orders/" + mockOrderId,
          id: mockOrderId,
          customerId: mockCustomerId,
          items: {
            quantity: 2,
            price: 10,
            total: 20,
            productId: mockProductId,
          },
          subTotal: 35,
          status: "Spedito",
          payment: "Carta",
          sellerId: mockSellerId,
          shipping_address: mockAddressId,
        },
      ];
    });
  });

  afterAll(async () => {
    orderSpyFind.mockRestore();
  });

  test("GET /api/v2/orders/catalogv/:id ritorna tutti gli ordini di un venditore senza token", async () => {
    return request(app)
      .get("/api/v2/orders/catalogv/" + mockSellerId)
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  var token = jwt.sign(
    { email: "Venditore", account: "Venditore", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/orders/catalogv/:id ritorna tutti gli ordini di un venditore con token valido", async () => {
    return request(app)
      .get("/api/v2/orders/catalogv/" + mockSellerId)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200, [
        {
          self: "/api/v2/orders/" + mockOrderId.toString(),
          customerId: mockCustomerId.toString(),
          items: {
            quantity: 2,
            price: 10,
            total: 20,
            productId: mockProductId.toString(),
          },
          subTotal: 35,
          status: "Spedito",
          id: mockOrderId.toString(),
          payment: "Carta",
          sellerId: mockSellerId.toString(),
          shipping_address: mockAddressId.toString(),
        },
      ]);
  });
});
