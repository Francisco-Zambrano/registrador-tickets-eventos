export class ProductDTO {

    constructor(product) {

        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.stock = product.stock;
        this.code = product.code;
        this.category = product.category;
        this.thumbnails = product.thumbnails;
        
    };

};




