import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("123", "Produc 1", 10);
const product2 = new Product("456", "Produc 2", 10);

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
  }
}

describe("Unit test list product use case", () => {
  it("should list products", async () => {
    const productRepository = MockRepository();
    const usecase = new ListProductUseCase(productRepository);
    const result = await usecase.execute({});
    expect(result.products).toHaveLength(2);
    expect(result.products[0].id).toBe(product1.id);
    expect(result.products[0].name).toBe(product1.name);
    expect(result.products[0].price).toBe(product1.price);
    expect(result.products[1].id).toBe(product2.id);
    expect(result.products[1].name).toBe(product2.name);
    expect(result.products[1].price).toBe(product2.price);
  })
});