export class CartDTO {

    constructor(cart) {

        this.id = cart._id;
        this.products = cart.products.map(product => ({
            id: product.id,
            quantity: product.quantity,
            title: product.title,
            price: product.price,
            code: product.code,
            category: product.category,
            description: product.description
        }));
        
    };

};