import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import { InputUpdateCustomerDto } from "./update.customer.dto";

const customer = new Customer("123", "John");
const address = new Address("Street", 123, "Zip", "City");
customer.changeAddress(address);

let input: InputUpdateCustomerDto = {
  id: customer.id,
  name: "John Updated",
  address: {
    street: "Street Update",
    number: 1234,
    zip: "Zip Updated",
    city: "City Updated",
  },
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe("Unit test for customer update use case", () => {
  it("should update a customer", async () => {
    const customerRepository = MockRepository();
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);
    const output = await customerUpdateUseCase.execute(input);
    expect(output).toEqual(input);
  })
})