import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import { v4 as uuid } from "uuid";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("abc", 123, "abc", "abc");
    customer.changeAddress(address);
    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const product = new Product(uuid(), "Product 1", 15);
    const productRepository = new ProductRepository();
    await productRepository.create(product);

    const orderItem = new OrderItem(uuid(), product.name, product.price, product.id, 2);
    const order = new Order(uuid(), customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);
    expect(foundOrder).toEqual(order);
  })

  it("should find all orders", async () => {
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("abc", 123, "abc", "abc");
    customer.changeAddress(address);
    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const product = new Product(uuid(), "Product 1", 15);
    const productRepository = new ProductRepository();
    await productRepository.create(product);

    const orderItem = new OrderItem(uuid(), product.name, product.price, product.id, 2);
    const order = new Order(uuid(), customer.id, [orderItem]);

    const orderItem2 = new OrderItem(uuid(), product.name, product.price, product.id, 4);
    const order2 = new Order(uuid(), customer.id, [orderItem2]);
    
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(order2);
    
    const orders = await orderRepository.findAll();
    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order);
    expect(orders).toContainEqual(order2);
  })

  it("should update an order", async () => {
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("abc", 123, "abc", "abc");
    customer.changeAddress(address);
    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const product = new Product(uuid(), "Product 1", 15);
    const product2 = new Product(uuid(), "Product 2", 20);
    const productRepository = new ProductRepository();
    await productRepository.create(product);
    await productRepository.create(product2);
    
    const orderItem = new OrderItem(uuid(), product.name, product.price, product.id, 2);
    const order = new Order(uuid(), customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    
    const orderItem2 = new OrderItem(uuid(), product2.name, product2.price, product2.id, 1);
    const updatedOrder = await orderRepository.find(order.id);
    updatedOrder.addItem(orderItem2);
    await orderRepository.update(updatedOrder);

    const foundOrder = await orderRepository.find(updatedOrder.id);
    expect(foundOrder.items).toContainEqual(orderItem);
    expect(foundOrder.items).toContainEqual(orderItem2);
    expect(foundOrder.total()).toBe(50);
  })
});
