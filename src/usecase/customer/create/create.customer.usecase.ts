import Customer from "../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../domain/customer/value-object/address";
import { InputCreateCustomerDto, OutputCreateCustomerDto } from "./create.customer.dto";
import { v4 as uuid } from "uuid";

export default class CreateCustomerUseCase {
  private customerRepository: CustomerRepositoryInterface;

  constructor(customerRepository: CustomerRepositoryInterface) {
    this.customerRepository = customerRepository;
  }

  async execute(input: InputCreateCustomerDto): Promise<OutputCreateCustomerDto> {
    const customer = new Customer(uuid(), input.name);
    const address = new Address(input.address.street, input.address.number, input.address.zip, input.address.city);
    customer.changeAddress(address);
    await this.customerRepository.create(customer);
    const customerCreated = await this.customerRepository.find(customer.id);
    return {
      id: customerCreated.id,
      name: customerCreated.name,
      address: {
        street: customerCreated.Address.street,
        number: customerCreated.Address.number,
        city: customerCreated.Address.city,
        zip: customerCreated.Address.zip,
      }
    }
  }
}