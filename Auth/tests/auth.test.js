const request = require("supertest");
const app = require("../app");
const User = require("../app/models/user");
const mongoose = require("mongoose");;

jest.mock("../app/models/user");

describe("Auth API Tests", () => {

  afterAll(() => {
    mongoose.connection.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect successfully with valid credentials", async () => {
    User.findOne.mockResolvedValue({
      email: "user@example.com",
      password: "$2b$10$.o4WekYhysF236hlTiuGj.usdOE8yWH86tvS1CaWBCsg.F1ub95/S",
      emailConfirmed: true,
    });

    const response = await request(app).post("/login").send({
      email: "user@example.com",
      password: "13C01t2001#",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("shouldn not connect successfully with valid credentials and non-confirmed email", async () => {
    User.findOne.mockResolvedValue({
      email: "user@example.com",
      password: "$2b$10$.o4WekYhysF236hlTiuGj.usdOE8yWH86tvS1CaWBCsg.F1ub95/S",
      emailConfirmed: false,
    });

    const response = await request(app).post("/login").send({
      email: "user@example.com",
      password: "13C01t2001#",
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Please confirm your email before logging in. We've sent an email to the email adress associated with your account."
    );
  });

  it("should return error for invalid email", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app).post("/login").send({
      email: "invalid@example.com",
      password: "password123",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return error for invalid password", async () => {
    User.findOne.mockResolvedValue({
      email: "user@example.com",
      password: "$2b$10$.o4WekYhysF236hlTiuGj.usdOE8yWH86tvS1CaWBCsg.F1ub95/S",
      emailConfirmed: true,
    });

    const response = await request(app).post("/login").send({
      email: "user@example.com",
      password: "invalidpassworD123*",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid password");
  });
});
