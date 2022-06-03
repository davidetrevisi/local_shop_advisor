/**
 * https://www.npmjs.com/package/supertest
 */
const request = require("supertest");
const app = require("./app");

describe("GET /api/v2/shops", () => {
  let shopSpy;
  let shopSpyFindById;

  beforeAll(() => {
    const Shop = require("./models/shop");
    shopSpy = jest.spyOn(Shop, "find").mockImplementation((criterias) => {
      return [
        {
          self: "/api/v2/shops/1010",
          name: "Negozio",
          description: "Descrizione",
          position: "Via",
          category: "Abbigliamento",
          tags: "Abbigliamento, Felpe",
        },
      ];
    });
    shopSpyFindById = jest.spyOn(Shop, "findById").mockImplementation((id) => {
      if (id == 1010)
        return {
          self: "/api/v2/shops/1010",
          name: "Negozio",
          description: "Descrizione",
          position: "Via",
          category: "Abbigliamento",
          tags: "Abbigliamento, Felpe",
        };
      else return {};
    });
  });

  afterAll(async () => {
    shopSpy.mockRestore();
    shopSpyFindById.mockRestore();
  });

  test("GET /api/v2/shops should respond with an array of products", async () => {
    return request(app)
      .get("/api/v2/shops")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: "/api/v2/shops/1010",
            name: "Negozio",
            description: "Descrizione",
            position: "Via",
            category: "Abbigliamento",
            tags: "Abbigliamento, Felpe",
          });
        }
      });
  });

  test("GET /api/v2/shops/:id should respond with json", async () => {
    return request(app)
      .get("/api/v2/shops/1010")
      .expect("Content-Type", /json/)
      .expect(200, {
        self: "/api/v2/shops/1010",
        name: "Negozio",
        description: "Descrizione",
        position: "Via",
        category: "Abbigliamento",
        tags: "Abbigliamento, Felpe",
      });
  });
});
