/**
 * https://www.npmjs.com/package/supertest
 */
const request = require("supertest");
const app = require("./app");
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const mongoose = require("mongoose");

describe("GET /api/v2/authentications", () => {
  let connection;
  let mockUserId = new mongoose.Types.ObjectId();

  beforeAll(async () => {
    jest.setTimeout(8000);
    jest.unmock("mongoose");
    connection = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected!");
  });

  afterAll(() => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  var token = jwt.sign(
    { email: "Admin", account: "Admin", id: mockUserId },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 }
  );

  test("GET /api/v2/authentications/users/ lista degli account", () => {
    return request(app)
      .get("/api/v2/authentications/users/")
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  test("GET /api/v2/authentications/users/ lista degli account", () => {
    return request(app)
      .get("/api/v2/authentications/users/")
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("DELETE /api/v2/authentications/users/:id eliminazione account", () => {
    return request(app)
      .delete("/api/v2/authentications/users/" + mockUserId)
      .expect("Content-Type", /json/)
      .expect(401, { success: false, message: "No token provided." });
  });

  test("POST /api/v2/authentications/login login account non esistente", () => {
    return request(app)
      .post("/api/v2/authentications/login")
      .set("Accept", "application/json")
      .send({
        email: "1",
        password: "cliente",
      })
      .expect({
        success: false,
        message: "Authentication failed. User not found.",
      });
  });
});
