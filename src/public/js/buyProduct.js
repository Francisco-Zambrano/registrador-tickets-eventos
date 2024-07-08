import { logger } from "../../utils/logger.js";

document.addEventListener('DOMContentLoaded', () => {

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
    addToCartButtons.forEach(button => {

        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');
    
            try {
                const response = await fetch(`/api/carts/add-product`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });
        
                const result = await response.json();
                if (result.msg === 'Product added to cart') {
                    alert('Producto agregado al carrito');
                } else {
                    alert('Error al agregar el producto al carrito');
                }
            } catch (error) {
                logger.error('Error adding product to cart:', error);
            }
        });

    });
});