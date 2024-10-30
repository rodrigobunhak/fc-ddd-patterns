import request from "supertest";
import { app, sequelize } from "../express"

describe("E2E test for products", () => {

  beforeEach(async () => await sequelize.sync({ force: true}));

  afterAll(async () => sequelize.close());

  it("should list all products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 15
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Product 2",
        price: 25
      });
    expect(response2.status).toBe(200);
    const listResponse = await request(app).get("/product").send();
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product = listResponse.body.products[0];
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(15);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Product 2");
    expect(product2.price).toBe(25);
  })
})