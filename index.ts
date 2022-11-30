import { ObjectId } from 'mongodb';
import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import Product, { ProductTemplate } from './Product';
import bodyParser from 'body-parser';
import Order, { OrderTemplate } from './Order';
const cors = require('cors')

dotenv.config();

const app: Express = express();

app.use(cors())

const jsonParser = bodyParser.json();

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Clarigraphy BE Server');
});

// Products

app.get('/products', async (req, res) => {
  try {
    const products = await Product.getProducts();
    res.status(200).send(products);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

app.post('/products', jsonParser, async (req, res) => {
  try {
    const { name, price, details, picLink } = req.body as ProductTemplate;
    const newProduct = new Product(name, price, details, picLink);
    const result = await newProduct.createProduct();
    if (result) {
      res.status(201).send(`Success with ID ${result.insertedId}`);
    } else {
      res.status(500).send("Failure");
    }
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

app.put('/products/:id', jsonParser, async (req, res) => {
  try {
    const id = req?.params?.id;
    const { name, price, details, picLink } = req.body as ProductTemplate;
    
    const updatedProduct = new Product(name, price, details, picLink, new ObjectId(id));
    const result = await updatedProduct.updateProduct();
    if (result) {
      res.status(200).send(`Success with ID ${id}`);
    } else {
      res.status(304).send("Failure");
    }
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    const result = await Product.deleteProduct(new ObjectId(id));

    if (result && result.deletedCount) {
      res.status(202).send(`Successfully removed game with id ${id}`);
    } else if (!result) {
        res.status(400).send(`Failed to remove game with id ${id}`);
    } else if (!result.deletedCount) {
        res.status(404).send(`Game with id ${id} does not exist`);
    }
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

// Orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.getOrders();
    res.status(200).send(orders);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

app.post('/orders', jsonParser, async (req, res) => {
  try {
    console.log(req.body)
    const { customerName, address, email, phone, orderDetails } = req.body as OrderTemplate;
    const newOrder = new Order(customerName, address, email, phone, orderDetails);
    const result = await newOrder.createOrder();
    if (result) {
      res.status(201).send(`Success with ID ${result.insertedId}`);
    } else {
      res.status(500).send("Failure");
    }
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});