const express=require("express");
const ProductManager=require("./productManager.js")

const PORT=8080;
const app=express();

app.get('/products', (req, res)=>{

    const {limit} = req.query;
    const product = new ProductManager();
    const data = product.getProducts(limit);
    return res.json({data:data})

});

app.get('/products/:pid', (req, res)=> {

    const {pid} = req.params;
    const product = new ProductManager();
    const data = product.getProductById(Number(pid));
    return res.json({data});

})

app.listen(PORT, () => {
    console.log(`Corriendo servidor en el puerto ${PORT}`)
});
