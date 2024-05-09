const buy = async (pid) => {
    try {
        let result = await fetch(`/carts`, {
            method: 'POST'
        });

        if (result.ok) {
            let cart = await result.json();
            let cid = cart._id;
            
            let addProductResult = await fetch(`/carts/${cid}/products/${pid}`, {
                method: 'POST'
            });

            if (addProductResult.ok) {
                console.log('Product added to cart');
            } else {
                console.error('Error adding product to cart:', addProductResult.statusText);
            }
        } else {
            console.error('Error creating cart:', result.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


