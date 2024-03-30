import express from "express";
import products from './routers/products.js';
import carts from './routers/carts.js';

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

app.use('/api/products', products);
app.use('/api/carts', carts);

app.listen(PORT, () => {
    console.log(`Corriendo servidor en el puerto ${PORT}`)
});