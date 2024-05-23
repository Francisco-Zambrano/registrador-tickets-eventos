import express from "express";
import mongoose from 'mongoose'
import { Server, Socket } from "socket.io";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import {router as productsRouter} from './routers/productsRouter.js';
import {router as cartsRouter} from './routers/cartsRouter.js';
import {router as viewsRouter} from './routers/viewsRouter.js';
import {router as sessionsRouter } from './routers/sessionsRouter.js';
import { productsModel } from "./dao/models/productsModel.js";
import { messagesModel } from "./dao/models/messagesModel.js";
import sessions from "express-session";
import MongoStore from "connect-mongo";
import { initPassport } from "./config/passport.config.js";
import passport from "passport";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(sessions({

  store: MongoStore.create({
    mongoUrl:"mongodb+srv://franzambrano16:95675030@cluster0.kifia6i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=sessions",
    ttl:360,
  }),
  secret: "adminCod3r123",
  resave: true, 
  saveUninitialized: true,

}));

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


app.use('/', viewsRouter)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);

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

      // let result = await productsModel.find().explain("executionStats")
      // console.log(JSON.stringify(result.executionStats, null, 15))

      // let products = await productsModel.paginate({category: "mouses"}, {limit: 2, page: 1})
      // console.log(products)

  } catch (error) {
      console.log(`Error getting database ${error}`);
  }
};

await dbConnection();



const io = new Server(expressServer);

io.on('connection', async (socket) => {
  
// Socket de productos
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

// Socket para el chat
  
  socket.on("id", async (name, email) => {
    try {
      await messagesModel.create({ user: name, email, message});
      const previousMessages = await messagesModel.find().sort({ createdAt: 1 }).exec();
      socket.emit("previousMessages", previousMessages);
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  });

  socket.on("message", async (name, email, message) => {
    try {
      await messagesModel.create({ user: name, email, message });
      io.emit("newMessage", name, message);
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  });
  console.log(`A client with id: ${socket.id} has connected `);
});
