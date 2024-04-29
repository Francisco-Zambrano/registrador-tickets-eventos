import express from "express";
import mongoose from 'mongoose'
import { Server, Socket } from "socket.io";
import { engine } from "express-handlebars";
import products from './routers/products.js';
import carts from './routers/carts.js';
import __dirname from "./utils.js";
import views from './routers/views.js';
import { productsModel } from "./dao/models/productsModel.js";


const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use('/', views)
app.use('/api/products', products);
app.use('/api/carts', carts);

const expressServer = app.listen(PORT, () => {
    console.log(`Running server on port: ${PORT}`)
});

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

const io = new Server(expressServer);

io.on('connection', async (socket) => {

  console.log("cliente conectado")
  const products = await productsModel.find();
  socket.emit('products', products);

  socket.on('addProductFromForm', async (product) => {
        
    try {
      const newProduct = await productsModel.create({...product});
      if (newProduct) {
          products.push(newProduct);
          io.emit('products', products); 
      }
  } catch (error) {
      console.error('Error adding product:', error);
  }

  });

});
