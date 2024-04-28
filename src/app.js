import express from "express";
import mongoose from 'mongoose'
import { Server, Socket } from "socket.io";
import { engine } from "express-handlebars";
import products from './routers/products.js';
import carts from './routers/carts.js';
import __dirname from "./utils.js";
import views from './routers/views.js';
import ProductManager from "./dao/productManagerMONGO.js";


const app = express();
const PORT = 8080;

const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use('/', views)
app.use('/api/products', products);
app.use('/api/carts', carts);

const dbConnection = async () => {
  try {
      await mongoose.connect('mongodb+srv://franzambrano16:95675030@cluster0.kifia6i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', 
      {
          dbName: "ecommerce"
      });
      console.log('database online')
  } catch (error) {
      console.log(`Error getting database ${error}`);
  }
};

await dbConnection();

const expressServer = app.listen(PORT, () => {
    console.log(`Running server on port: ${PORT}`)
});

const socketServer = new Server(expressServer);

socketServer.on('connection', socket => {

  console.log("cliente conectado")
  const products = product.getProducts();
  socket.emit('products', products);

  socket.on('addProductFromForm', newProduct => {
        
    const { title, description, price, thumbnail, code, stock, status, category } = newProduct;

    const product = new ProductManager();
    const result = product.addProduct(title, description, price, thumbnail, code, stock, status, category);

    result = socket.emit('productAdded' && 'updateProducts')

  });

});
