/**
 * https://www.npmjs.com/package/supertest
 */
const request = require("supertest");
const app = require("./app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("GET /api/v2/products", () => {
  let productSpy;
  let productSpyFindById;
  let mockProductId = new mongoose.Types.ObjectId();
  let mockProductId2 = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();
  let mockShopId = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Product = require("./models/product");
    productSpy = jest.spyOn(Product, "find").mockImplementation(() => {
      return [
        {
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
        {
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
      ];
    });
    productSpyFindById = jest
      .spyOn(Product, "findById")
      .mockImplementation((id) => {
        if (id == mockProductId.toString())
          return {
            id: mockProductId,
            name: "Felpa",
            description: "Una bella felpa",
            price: 10,
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId,
            shopId: mockShopId,
          };
        else return {};
      });
  });

  afterAll(async () => {
    productSpy.mockRestore();
    productSpyFindById.mockRestore();
  });

  test("GET /api/v2/products ritorna un array di prodotti", async () => {
    return request(app)
      .get("/api/v2/products")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: "/api/v2/products/" + mockProductId,
            id: mockProductId.toString(),
            name: "Felpa",
            description: "Una bella felpa",
            price: 10,
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
            shopId: mockShopId.toString(),
          });
          expect(res.body[1]).toEqual({
            self: "/api/v2/products/" + mockProductId2,
            id: mockProductId2.toString(),
            name: "Felpa",
            description: "Una bella felpa",
            price: 10,
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
            shopId: mockShopId.toString(),
          });
        }
      });
  });

  test("GET /api/v2/products/:id ritorna un Json del prodotto", async () => {
    return request(app)
      .get("/api/v2/products/" + mockProductId)
      .expect("Content-Type", /json/)
      .expect(200, {
        self: "/api/v2/products/" + mockProductId,
        id: mockProductId.toString(),
        name: "Felpa",
        description: "Una bella felpa",
        price: 10,
        category: "Abbigliamento",
        tags: ["Abbigliamento", "Felpe"],
        images: ["images//image.jpg", "images//image2.jpg"],
        userId: mockUserId.toString(),
        shopId: mockShopId.toString(),
      });
  });
});

describe("GET /api/v2/products/find/:name", () => {
  let productSpyFindByName;
  let mockProductId = new mongoose.Types.ObjectId();
  let mockProductId2 = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();
  let mockShopId = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Product = require("./models/product");
    productSpyFindByName = jest
      .spyOn(Product, "find")
      .mockImplementation(() => {
        return [
          {
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
          {
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
        ];
      });
  });

  afterAll(async () => {
    productSpyFindByName.mockRestore();
  });

  test("GET /api/v2/products/find/:name ricerca prodotto per nome", async () => {
    return request(app)
      .get("/api/v2/products/find/" + "Felpa")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0].name).toEqual("Felpa");
          expect(res.body[0]).toEqual({
            self: "/api/v2/products/" + mockProductId,
            id: mockProductId.toString(),
            name: "Felpa",
            description: "Una bella felpa",
            price: 10,
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
            shopId: mockShopId.toString(),
          });
          expect(res.body[1].name).toEqual("Felpa");
          expect(res.body[1]).toEqual({
            self: "/api/v2/products/" + mockProductId2,
            id: mockProductId2.toString(),
            name: "Felpa",
            description: "Una bella felpa",
            price: 10,
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
            shopId: mockShopId.toString(),
          });
        }
      });
  });
});

describe("GET /api/v2/products/catalog/:id", () => {
  let productSpyFindByUserId;
  let mockProductId = new mongoose.Types.ObjectId();
  let mockProductId2 = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();
  let mockShopId = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Product = require("./models/product");
    productSpyFindByUserId = jest
      .spyOn(Product, "find")
      .mockImplementation(() => {
        return [
          {
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
          {
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
        ];
      });
  });

  afterAll(async () => {
    productSpyFindByUserId.mockRestore();
  });

  test("GET /api/v2/products/catalog/:id ricerca prodotto per utente senza token", async () => {
    return request(app)
      .get("/api/v2/products/catalog/" + mockUserId)
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  var token = jwt.sign(
    { email: "Venditore", account: "Venditore", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/products/catalog/:id ricerca prodotto per utente con token valido", async () => {
    return request(app)
      .get("/api/v2/products/catalog/" + mockUserId)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0].userId).toEqual(mockUserId.toString());
          expect(res.body[0]).toEqual({
            self: "/api/v2/products/" + mockProductId,
            id: mockProductId.toString(),
            name: "Felpa",
            description: "Una bella felpa",
            price: 10,
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
            shopId: mockShopId.toString(),
          });
          expect(res.body[1].userId).toEqual(mockUserId.toString());
          expect(res.body[1]).toEqual({
            self: "/api/v2/products/" + mockProductId2,
            id: mockProductId2.toString(),
            name: "Felpa",
            description: "Una bella felpa",
            price: 10,
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
            shopId: mockShopId.toString(),
          });
        }
      });
  });
});

describe("GET /api/v2/products/shop/:id", () => {
  let productSpyFindByShopId;
  let mockProductId = new mongoose.Types.ObjectId();
  let mockProductId2 = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();
  let mockShopId = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Product = require("./models/product");
    productSpyFindByShopId = jest
      .spyOn(Product, "find")
      .mockImplementation(() => {
        return [
          {
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
          {
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
        ];
      });
  });

  afterAll(async () => {
    productSpyFindByShopId.mockRestore();
  });

  test("GET /api/v2/products/shop/:id ricerca prodotto per negozio senza token", async () => {
    return request(app)
      .get("/api/v2/products/shop/" + mockShopId)
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  var token = jwt.sign(
    { email: "Venditore", account: "Venditore", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/products/shop/:id ricerca prodotto per negozio con token valido", async () => {
    return request(app)
      .get("/api/v2/products/shop/" + 1)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0].shopId).toEqual(mockShopId.toString());
          expect(res.body[0]).toEqual({
            self: "/api/v2/products/" + mockProductId.toString(),
            id: mockProductId.toString(),
            name: "Felpa",
            description: "Una bella felpa",
            price: 10,
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
            shopId: mockShopId.toString(),
          });
          expect(res.body[1].shopId).toEqual(mockShopId.toString());
          expect(res.body[1]).toEqual({
            self: "/api/v2/products/" + mockProductId2.toString(),
            id: mockProductId2.toString(),
            name: "Felpa",
            description: "Una bella felpa",
            price: 10,
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
            shopId: mockShopId.toString(),
          });
        }
      });
  });
});
