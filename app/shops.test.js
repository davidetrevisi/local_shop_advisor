/**
 * https://www.npmjs.com/package/supertest
 */
const request = require("supertest");
const app = require("./app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("GET /api/v2/shops", () => {
  let shopSpy;
  let shopSpyFindById;
  let mockShopId = new mongoose.Types.ObjectId();
  let mockShopId2 = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Shop = require("./models/shop");
    shopSpy = jest.spyOn(Shop, "find").mockImplementation(() => {
      return [
        {
          self: "/api/v2/shops/" + mockShopId,
          id: mockShopId,
          name: "Negozio di prova",
          description: "Il mio negozio di prova",
          position: "Via Prova 12",
          category: "Abbigliamento",
          tags: ["Abbigliamento", "Felpe"],
          images: ["images//image.jpg", "images//image2.jpg"],
          userId: mockUserId,
        },
        {
          self: "/api/v2/shops/" + mockShopId2,
          id: mockShopId2,
          name: "Negozio di prova 2",
          description: "Il mio negozio di prova 2",
          position: "Via Prova 12",
          category: "Abbigliamento",
          tags: ["Abbigliamento", "Felpe"],
          images: ["images//image.jpg", "images//image2.jpg"],
          userId: mockUserId,
        },
      ];
    });
    shopSpyFindById = jest.spyOn(Shop, "findById").mockImplementation((id) => {
      if (id == mockShopId.toString())
        return {
          self: "/api/v2/shops/" + mockShopId,
          id: mockShopId,
          name: "Negozio di prova",
          description: "Il mio negozio di prova",
          position: "Via Prova 12",
          category: "Abbigliamento",
          tags: ["Abbigliamento", "Felpe"],
          images: ["images//image.jpg", "images//image2.jpg"],
          userId: mockUserId,
        };
      else return {};
    });
  });

  afterAll(async () => {
    shopSpy.mockRestore();
    shopSpyFindById.mockRestore();
  });

  test("GET /api/v2/shops/ ritorna un array di negozi senza token", async () => {
    return request(app)
      .get("/api/v2/shops/")
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  var token = jwt.sign(
    { email: "Venditore", account: "Venditore", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/shops ritorna un array di negozi con token valido", async () => {
    return request(app)
      .get("/api/v2/shops")
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: "/api/v2/shops/" + mockShopId.toString(),
            id: mockShopId.toString(),
            name: "Negozio di prova",
            description: "Il mio negozio di prova",
            position: "Via Prova 12",
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
          });
          expect(res.body[1]).toEqual({
            self: "/api/v2/shops/" + mockShopId2.toString(),
            id: mockShopId2.toString(),
            name: "Negozio di prova 2",
            description: "Il mio negozio di prova 2",
            position: "Via Prova 12",
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
          });
        }
      });
  });

  test("GET /api/v2/shops/:id ritorna un Json del negozio senza token", async () => {
    return request(app)
      .get("/api/v2/shops/" + mockShopId)
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  var token = jwt.sign(
    { email: "Venditore", account: "Venditore", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/shops/:id ritorna un Json del negozio con token valido", async () => {
    return request(app)
      .get("/api/v2/shops/" + mockShopId)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200, {
        self: "/api/v2/shops/" + mockShopId.toString(),
        id: mockShopId.toString(),
        name: "Negozio di prova",
        description: "Il mio negozio di prova",
        position: "Via Prova 12",
        category: "Abbigliamento",
        tags: ["Abbigliamento", "Felpe"],
        images: ["images//image.jpg", "images//image2.jpg"],
        userId: mockUserId.toString(),
      });
  });
});

describe("GET /api/v2/shops/list/:id", () => {
  let shopSpyFindByUserId;
  let mockShopId = new mongoose.Types.ObjectId();
  let mockShopId2 = new mongoose.Types.ObjectId();
  let mockUserId = new mongoose.Types.ObjectId();

  beforeAll(() => {
    const Shop = require("./models/shop");
    shopSpyFindByUserId = jest.spyOn(Shop, "find").mockImplementation(() => {
      return [
        {
          self: "/api/v2/shops/" + mockShopId,
          id: mockShopId,
          name: "Negozio di prova",
          description: "Il mio negozio di prova",
          position: "Via Prova 12",
          category: "Abbigliamento",
          tags: ["Abbigliamento", "Felpe"],
          images: ["images//image.jpg", "images//image2.jpg"],
          userId: mockUserId,
        },
        {
          self: "/api/v2/shops/" + mockShopId2,
          id: mockShopId2,
          name: "Negozio di prova 2",
          description: "Il mio negozio di prova 2",
          position: "Via Prova 12",
          category: "Abbigliamento",
          tags: ["Abbigliamento", "Felpe"],
          images: ["images//image.jpg", "images//image2.jpg"],
          userId: mockUserId,
        },
      ];
    });
  });

  afterAll(async () => {
    shopSpyFindByUserId.mockRestore();
  });

  test("GET /api/v2/shops/list/:id ricerca negozio per utente senza token", async () => {
    return request(app)
      .get("/api/v2/shops/list/" + mockUserId)
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  var token = jwt.sign(
    { email: "Venditore", account: "Venditore", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/shops/list/:id ricerca negozio per utente con token valido", async () => {
    return request(app)
      .get("/api/v2/shops/list/" + mockUserId)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0].userId).toEqual(mockUserId.toString());
          expect(res.body[0]).toEqual({
            self: "/api/v2/shops/" + mockShopId.toString(),
            id: mockShopId.toString(),
            name: "Negozio di prova",
            description: "Il mio negozio di prova",
            position: "Via Prova 12",
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
          });
          expect(res.body[1].userId).toEqual(mockUserId.toString());
          expect(res.body[1]).toEqual({
            self: "/api/v2/shops/" + mockShopId2.toString(),
            id: mockShopId2.toString(),
            name: "Negozio di prova 2",
            description: "Il mio negozio di prova 2",
            position: "Via Prova 12",
            category: "Abbigliamento",
            tags: ["Abbigliamento", "Felpe"],
            images: ["images//image.jpg", "images//image2.jpg"],
            userId: mockUserId.toString(),
          });
        }
      });
  });
});
