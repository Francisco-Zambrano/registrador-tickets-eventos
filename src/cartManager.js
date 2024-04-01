import fs from 'fs';
import ProductManager from './productManager.js';

class CartManager {

    #cart;
    #path;
    static idProduct = 0;

    constructor() {
        this.#path = './src/data/cartData.json';
        this.#cart = this.#readCartProducts();
    }

    #idCartProduct() {
        let id = 1;
        if (this.#cart.length != 0)
            id = this.#cart[this.#cart.length - 1].id + 1;
        return id;
    }

    #readCartProducts() {
        try {
            if (fs.existsSync(this.#path))
                return JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
            return [];
        } catch (error) {
            throw new Error("Error reading file: " + error.message);
        }
    }

    #saveCartData() {
        try {
            fs.writeFileSync(this.#path, JSON.stringify(this.#cart));
        } catch (error) {
            throw new Error("Error saving file: " + error.message);
        }
    }

    createCart() {
        const newCart = {
            id: this.#idCartProduct(),
            products: []
        };

        this.#cart.push(newCart);
        this.#saveCartData();

        return newCart;
    }

    getCartById(id) {
        const product = this.#cart.find(data => data.id == id);
        return product ? product : "Not Found";
    }

    addProduct(cid, pid){
        let message = "The Cart does not exist";
        const indexCart = this.#cart.findIndex(cart => cart.id === cid)
        
        if(indexCart !==-1){

            const productInCart = this.#cart[indexCart].products.findIndex(data => data.id === pid);
            const data = new ProductManager();
            const product = data.getProductById(pid);

            if(product.status && productInCart === -1){
                this.#cart[indexCart].products.push({id: pid, 'quantity': 1});
                this.#saveCartData();
                message = "Products added to cart";

            }else if(product.status && productInCart !== -1){
                this.#cart[indexCart].products[productInCart].quantity++;
                this.#saveCartData();
                message = "Products added to cart";
                
            }else{
                message = "Product does not exist";
            }
        
        }
        return message;
    }

}

export default CartManager;