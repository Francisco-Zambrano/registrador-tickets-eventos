export class ProductDTO {

        constructor(product) {
    
            this.id = product._id;
            this.title = product.title;
            this.description = product.description;
            this.price = product.price;
            this.thumbnails = product.thumbnails;
            this.code = product.code;
            this.stock = product.stock;
            this.status = product.status;
            this.category = product.category;
            this.owner = product.owner;
    
        };
        
    };
