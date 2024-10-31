import Product from "../../../domain/product/entity/product";

import CreateProductUseCase from "./create.product.usecase";

const product = new Product("123", "Product 1", 25);
let input = {
  name: "Product 1",
  price: 25
}

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}

describe("Unit test create product use case", () => {
  beforeEach(() => {
    input = {
      name: "Product 1",
      price: 25
    }
  })
  
  it("should create a product", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const output = await createProductUseCase.execute(input);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    })
  })

  it("should thrown an error when name is missing", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    input.name = "";
    await expect(createProductUseCase.execute(input)).rejects.toThrow("Name is required");
  })

  it("should thrown an error when price is missing", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    input.price = 0;
    await expect(createProductUseCase.execute(input)).rejects.toThrow("product: Price must be greater than zero");
  })
})