import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto";

export default class FindProductUseCase {
  private productRepository: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  public async execute(input: InputFindProductDto): Promise<OutputFindProductDto> {
    const customer = await this.productRepository.find(input.id);
    return {
      id: customer.id,
      name: customer.name,
      price: customer.price
    }
  }
}