/**
 * https://www.npmjs.com/package/supertest
 */
const request = require("supertest");
const app = require("./app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("GET /api/v2/carts", () => {
  let cartSpy;
  let mockCartId = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();
  let mockShopId = new mongoose.Types.ObjectId();
  let mockProductId = new mongoose.Types.ObjectId();
  let mockProductId2 = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Cart = require("./models/cart").Cart;
    cartSpy = jest.spyOn(Cart, "findOne").mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        self: "/api/v2/carts/" + mockCartId,
        id: mockCartId,
        userId: mockUserId,
        items: [
          {
            quantity: 2,
            price: 10,
            total: 20,
            productId: {
              id: mockProductId,
              name: "Felpa",
              description: "Una bella felpa",
              price: 10,
              category: "Abbigliamento",
              tags: ["Abbigliamento", "Felpe"],
              images: ["images//image.jpg", "images//image2.jpg"],
              userId: mockUserId,
              shopId: mockShopId,
            },
          },
          {
            quantity: 3,
            price: 5,
            total: 15,
            productId: {
              id: mockProductId2,
              name: "Felpa",
              description: "Una bella felpa",
              price: 10,
              category: "Abbigliamento",
              tags: ["Abbigliamento", "Felpe"],
              images: ["images//image.jpg", "images//image2.jpg"],
              userId: mockUserId,
              shopId: mockShopId,
            },
          },
        ],
        subTotal: 35,
      }),
    });
  });

  afterAll(async () => {
    cartSpy.mockRestore();
  });

  test("GET /api/v2/carts/:id ritorna il carrello dell'utente senza token", async () => {
    return request(app)
      .get("/api/v2/carts/" + mockCartId)
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  var token = jwt.sign(
    { email: "Cliente", account: "Cliente", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/carts/:id ritorna il carrello dell'utente con token valido", async () => {
    return request(app)
      .get("/api/v2/carts/" + mockCartId)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200, {
        self: "/api/v2/carts/" + mockCartId.toString(),
        id: mockCartId.toString(),
        userId: mockUserId.toString(),
        items: [
          {
            quantity: 2,
            price: 10,
            total: 20,
            productId: {
              id: mockProductId.toString(),
              name: "Felpa",
              description: "Una bella felpa",
              price: 10,
              category: "Abbigliamento",
              tags: ["Abbigliamento", "Felpe"],
              images: ["images//image.jpg", "images//image2.jpg"],
              userId: mockUserId.toString(),
              shopId: mockShopId.toString(),
            },
          },
          {
            quantity: 3,
            price: 5,
            total: 15,
            productId: {
              id: mockProductId2.toString(),
              name: "Felpa",
              description: "Una bella felpa",
              price: 10,
              category: "Abbigliamento",
              tags: ["Abbigliamento", "Felpe"],
              images: ["images//image.jpg", "images//image2.jpg"],
              userId: mockUserId.toString(),
              shopId: mockShopId.toString(),
            },
          },
        ],
        subTotal: 35,
      });
  });
});
