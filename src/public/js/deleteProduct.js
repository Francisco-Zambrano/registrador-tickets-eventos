document.addEventListener('DOMContentLoaded', () => {

    const deleteToCartButtons = document.querySelectorAll('.delete-to-cart');

    deleteToCartButtons.forEach(button => {

        button.addEventListener('click', async (event) => {
            const productId = event.currentTarget.getAttribute('data-product-id');
            const cartId = window.userCartId;

            if (!cartId || !productId) {
                console.error('Cart ID or Product ID is missing');
                alert('Error al eliminar el producto del carrito: faltan datos');
                return;
            }

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                if (result.msg === 'Product deleted') {
                    
                } else {
                    location.reload();
                    alert('Producto eliminado del carrito');
                }
            } catch (error) {
                console.error('Error deleting product from cart:', error);
                alert('Error al eliminar el producto del carrito');
            }
        });

    });

});