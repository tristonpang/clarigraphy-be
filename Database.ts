import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export default class Database {
  static instance: Database;
  
  client: MongoClient;
  db: Db;
  productsCollection: Collection;
  ordersCollection: Collection;

  // client.connect(err => {
  //   const collection = client.db("test").collection("devices");
  //   // perform actions on the collection object
  //   client.close();
  // });

  private constructor() {
    const uri: string = process.env.DB_URI as string;
    this.client = new MongoClient(uri);
    this.client.connect();
    this.db = this.client.db("production");

    this.productsCollection = this.db.collection("products");
    this.ordersCollection = this.db.collection("orders");
    console.log(`Successfully connected to database: ${this.db.databaseName} and collections: ${this.productsCollection.collectionName} and ${this.ordersCollection.collectionName}`);
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  
}

