import express from "express";
import mongoose from 'mongoose';
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import cookieParser from 'cookie-parser';
import __dirname from "./utils.js";
import { router as productsRouter } from './routers/productsRouter.js';
import { router as cartsRouter } from './routers/cartsRouter.js';
import { router as viewsRouter } from './routers/viewsRouter.js';
import { router as sessionsRouter } from './routers/sessionsRouter.js';
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import { config } from "./config/config.js";
import { productsModel } from "./dao/models/productsModel.js";


const app = express();
const PORT = config.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

initPassport();
app.use(passport.initialize());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);

const expressServer = app.listen(PORT, () => {
    console.log(`Running server on port: ${PORT}`);
});

const dbConnection = async () => {

    try {
        await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });
        console.log(`connected to ${config.DB_NAME} database`);
    } catch (error) {
        console.log(`Error getting database ${error}`);
    }

};

await dbConnection();

const io = new Server(expressServer);
io.on('connection', async (socket) => {

    const products = await productsModel.find();
    socket.emit('products', products);

    socket.on('addProductFromForm', async (product) => {

        try {
            const newProduct = await productsModel.create({ ...product });
            if (newProduct) {
                products.push(newProduct);
                io.emit('products', products);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }

    });

    socket.on("id", async (name, email) => {

        try {
            await messagesModel.create({ user: name, email, message });
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
