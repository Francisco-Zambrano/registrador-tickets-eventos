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
import { router as ticketsRouter } from './routers/ticketsRouter.js';
import { router as mockingRouter } from "./routers/mockingRouter.js";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import { config } from "./config/config.js";
import { productsModel } from "./dao/models/productsModel.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger, addLogger } from "./utils/logger.js";


const app = express();
const PORT = config.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.use(addLogger);

initPassport();
app.use(passport.initialize());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/mockingproducts', mockingRouter);

app.use('/loggerTest', (req, res) => {
    req.logger.fatal('This is a fatal log');
    req.logger.error('This is an error log');
    req.logger.warning('This is a warning log');
    req.logger.info('This is an info log');
    req.logger.http('This is a http log');
    req.logger.debug('This is a debug log');
    res.send('Logger test complete');
});

app.use(errorHandler);

const expressServer = app.listen(PORT, () => {
    logger.info(`Running server on port: ${PORT}`)
});

const dbConnection = async () => {

    try {
        await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });
        logger.info(`connected to ${config.DB_NAME} database`);
    } catch (error) {
        logger.error(`Error getting database ${error}`);
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
            logger.error('Error adding product:', error);
        }

    });

    socket.on("id", async (name, email) => {

        try {
            await messagesModel.create({ user: name, email, message });
            const previousMessages = await messagesModel.find().sort({ createdAt: 1 }).exec();
            socket.emit("previousMessages", previousMessages);
        } catch (error) {
            logger.error("Error saving message to database:", error);
        }

    });

    socket.on("message", async (name, email, message) => {

        try {
            await messagesModel.create({ user: name, email, message });
            io.emit("newMessage", name, message);
        } catch (error) {
            logger.error("Error saving message to database:", error);
        }
        
    });

    logger.info(`A client with id: ${socket.id} has connected `);

});