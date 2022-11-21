import Database from './Database';
import { ObjectId } from 'mongodb';

const database = Database.getInstance();

export interface ProductTemplate {
  name: string;
  price: number;
  details: string;
  picLink: string;
}

export default class Product {
  constructor(public name: string, public price: number, public details: string, public picLink: string, public _id?: ObjectId) {}

  /**
   * Get all existing products from DB. Returns array of Products
   */
  static async getProducts() {
    const products = (await database.productsCollection.find({}).toArray()) as unknown as Product[];
    return products;
  }

  /**
   * Create this Product instance on the DB
   * @param product the Product to be created and saved
   */
  async createProduct() {
    const result = await database.productsCollection.insertOne(this);
    return result;
  }

  /**
   * Update current Product instance with current field values and save to DB
   */
  async updateProduct() {
    const query = { _id: this._id };
    const result = await database.productsCollection.updateOne(query, { $set: this });
    return result;
  }

  /**
   * Delete Product instance on DB
   */
  static async deleteProduct(id: ObjectId) {
    const query = { _id: id };
    const result = await database.productsCollection.deleteOne(query);
    return result;
  }
}