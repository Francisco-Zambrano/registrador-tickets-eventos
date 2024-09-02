document.addEventListener('DOMContentLoaded', () => {
  
    const deleteListedProduct = document.querySelectorAll('.delete_listed_product');

    deleteListedProduct.forEach(button => {
    
        button.addEventListener('click', function(event) {
    
            event.preventDefault();
    
            const productId = this.getAttribute('data-id');
    
            if (confirm('Are you sure you want to delete this product?')) {
    
                fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }

                })
                .then(response => {
                    if (response.ok) {
                        alert('Product successfully deleted');
                        location.reload();
                    } else {
                        return response.json().then(data => {
                            throw new Error(data.message || 'Error deleting product');
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(`An error occurred while deleting the product: ${error.message}`);
                });
            }
        });
    });
    

});