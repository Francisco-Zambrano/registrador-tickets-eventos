document.addEventListener('DOMContentLoaded', () => {

    const deleteToCartButtons = document.querySelectorAll('.delete-to-cart');

    deleteToCartButtons.forEach(button => {

        button.addEventListener('click', async (event) => {
            const productId = event.currentTarget.getAttribute('data-product-id');
            const cartId = window.userCartId;

            if (!cartId || !productId) {
                console.error('Cart ID or Product ID is missing');
                alert('Error removing product from cart: missing data');
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
                    alert('Product removed from cart');
                }
            } catch (error) {
                console.error('Error deleting product from cart:', error);
                alert('Error removing product from cart');
            }
        });

    });

    const cartPurchaseButtons = document.querySelectorAll('.cart-purchase');

    cartPurchaseButtons.forEach(button => {

        button.addEventListener('click', async (event) => {
            const cartId = event.currentTarget.getAttribute('data-cart-id');

            if (!cartId) {
                console.error('Cart ID is missing');
                alert('Error buying cart');
                return;
            }

            try {
                const response = await fetch(`/api/carts/${cartId}/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                if (result.msg === 'Purchase completed, mail sent') {
                    alert('Purchase made successfully');
                    window.location.href = '/products';
                } else {
                    alert(result.msg);
                }
            } catch (error) {
                console.error('Error when making purchase:', error);
                alert('Error when making purchase');
            }
        });

    });

});