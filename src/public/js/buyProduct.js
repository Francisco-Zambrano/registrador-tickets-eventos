document.addEventListener('DOMContentLoaded', () => {

    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {

        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');
            const cartId = window.userCartId;

            if (!cartId || !productId) {
                console.error('Cart ID or Product ID is missing');
                alert('Error adding product to cart');
                return;
            }

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();
                if (result.msg === 'Product added to cart') {
                    alert('Product added to cart');
                } else {
                    alert('Error adding product to cart');
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
            }
        });

    });

});