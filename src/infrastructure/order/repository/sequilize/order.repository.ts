import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total,
      },
      {
        where: {
          id: entity.id
        },
      }
    )
    entity.items.forEach(async (item) => {
      await OrderItemModel.upsert(
        {
          id: item.id,
          order_id: entity.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        }
      )
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findByPk(id, { include: [{ model: OrderItemModel }] });
    const orderItems = orderModel.items.map(itemModel => {
      return new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity);
    })
    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  findAll(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
}
