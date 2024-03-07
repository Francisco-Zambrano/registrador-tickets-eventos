class ProductManager{

    #products;
    static idProduct = 0;

    constructor(){
        this.#products = []
    }

    addProduct(title, description, price, thumbnail, code, stock){

        if(!title || !description || !price || !thumbnail || !code || !stock){
            return "all parameters are required"
        }

        const uniqueCode = this.#products.some(product => product.code === code);
        if(uniqueCode) {
            return "Product Code Already Exist"
        }

        const id = ProductManager.idProduct = ProductManager.idProduct + 1;

        const newProduct = {
            id:id,
            title:title,
            description:description,
            price:price,
            thumbnail:thumbnail,
            code:code,
            stock:stock
        };

        this.#products.push(newProduct);

        return "Product successfully added"

    }

    getProducts(){

        return this.#products;

    }

    getProductById(id){

        const product = this.#products.find(data => data.id == id);
        return product ? product : "Not Found";

    }

}

module.exports = ProductManager
