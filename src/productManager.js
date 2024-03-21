const fs = require('fs');
const path = require('path');

class ProductManager{

    #products;
    #path;
    static idProduct = 0;

    constructor(){
        this.#path = path.resolve(__dirname, './data/products.json');
        this.#products = this.#readListProducts();
    }

    #readListProducts(){
        try{
            if(fs.existsSync(this.#path))
                return JSON.parse(fs.readFileSync(this.#path,'utf-8'));
            return []; 
        }catch(error){
            console.log("Error reading file");
        }
    }

    #saveNewData(){
        try{
            fs.writeFileSync(this.#path, JSON.stringify(this.#products));
        } catch(error){
            console.log("Error saving file");
        }
    }

    addProduct(title, description, price, thumbnail, code, stock){
        if(!title || !description || !price || !thumbnail || !code || !stock){
            return "All parameters are required";
        }
    
        const uniqueCode = this.#products.some(product => product.code === code);
        if(uniqueCode) {
            return "Product Code Already Exists";
        }
    
        const lastId = this.#products.length > 0 ? this.#products[this.#products.length - 1].id : 0;
        const id = lastId + 1;
    
        const newProduct = {id, title, description, price, thumbnail, code, stock};
        this.#products.push(newProduct);
        this.#saveNewData();
        return "Product successfully added";
    }
    
    getProducts(limit = 0){
        limit = Number(limit);
            return limit > 0 ? this.#products.slice(0, limit) : this.#products;
    }

    getProductById(id){
        const product = this.#products.find(data => data.id == id);
        return product ? product : "Not Found";
    }

    updateProduct(id, objectUpdate){
        let message = "The product does not exist"

        const index = this.#products.findIndex(p=> p.id ===id);

        if (index !== -1){
            const {id, ...res} = objectUpdate;
            this.#products[index] = {...this.#products[index], ...res}
            this.#saveNewData();
            message = "Updated Product";
        }

        return message;
    } 

    deleteProduct(id){
        let message = "The product does not exist"

        const index = this.#products.findIndex(p=> p.id === id);
        if (index !== -1){
            this.#products = this.#products.filter(p=> p.id !== id);
            this.#saveNewData();
            message = "Deleted Product"
        } 
        return message;
    }

}

module.exports = ProductManager
