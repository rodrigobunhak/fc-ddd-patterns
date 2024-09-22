import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendConsoleLogHandler from "../event/handler/send-console-log.handler";
import SendConsoleLog1Handler from "../event/handler/send-console-log1.handler";
import SendConsoleLog2Handler from "../event/handler/send-console-log2.handler";
import Address from "../value-object/address";
import Customer from "./customer";
import { v4 as uuid } from "uuid";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it("should notify handler SendConsoleLog1Handler when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLog1Handler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    const customer = new Customer(uuid(), "John");
    customer.domainEvents.forEach(domainEvent => {
      eventDispatcher.notify(domainEvent);
    });
    customer.clearEvents();

    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyConsoleLog).toHaveBeenCalledWith("Esse é o primeiro console.log do evento: CustomerCreated");
    spyConsoleLog.mockRestore();
  })

  it("should notify handler SendConsoleLog2Handler when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLog2Handler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    const customer = new Customer(uuid(), "John");
    customer.domainEvents.forEach(domainEvent => {
      eventDispatcher.notify(domainEvent);
    })
    customer.clearEvents();

    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyConsoleLog).toHaveBeenCalledWith("Esse é o segundo console.log do evento: CustomerCreated");
    spyConsoleLog.mockRestore();
  })

  it("should notify handler SendConsoleLogHandler when customer address is updated", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    eventDispatcher.register('CustomerAddressChangedEvent', eventHandler);

    const customer = new Customer(uuid(), "John");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.changeAddress(address);
    customer.domainEvents.forEach(domainEvent => {
      eventDispatcher.notify(domainEvent);
    });
    customer.clearEvents();

    expect(spyEventHandler).toHaveBeenCalled();
    const logMessage = `Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.Address}`;
    expect(spyConsoleLog).toHaveBeenCalledWith(logMessage);
    spyConsoleLog.mockRestore();
  })
});
