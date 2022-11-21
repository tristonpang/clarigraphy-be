import Database from './Database';
import { ObjectId } from 'mongodb';

const database = Database.getInstance();

export interface OrderDetail {
  productId: string;
  quantity: number;
}

export interface OrderTemplate {
  customerName: string;
  address: string;
  email: string;
  phone: string;
  orderDetails: OrderDetail[];
}

export default class Order {
  constructor(public customerName: string, public address: string, public email: string, public phone: string, public orderDetails: OrderDetail[], public _id?: ObjectId) {}

  static async getOrders() {
    const orders = (await database.ordersCollection.find({}).toArray()) as unknown as Order[];
    return orders;
  }

  async createOrder() {
    const result = await database.ordersCollection.insertOne(this);
    return result;
  }
}