const socket = io();

socket.on('products', products => {

    const tbody = document.getElementById('products-id')
    tbody.innerHTML = '';

    products.forEach(product => {
        const row = tbody.insertRow();
        row.innerHTML = 
        `<tr>
            <td>${product.title}</td>
            <td>${product.code}</td>
            <td>${product.description}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>${product.price}</td>
        </tr>`
    });
});


const form = document.getElementById('product-form')

form.addEventListener('submit', function (event) {

    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const category = document.getElementById('category').value;
    const stock = document.getElementById('stock').value;
    const price = document.getElementById('price').value;
   
    const product = {
        title: title,
        description: description,
        code: code,
        category: category,
        stock: stock,
        price: price,
    };

    socket.emit('addProductFromForm', product);
    form.reset();

})
