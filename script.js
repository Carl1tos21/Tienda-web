let products = [];

function renderProducts() {
    const list = document.getElementById("product-list");
    list.innerHTML = "";

    products.forEach((product, index) => {
        list.innerHTML += `
            <div class="product">
                <span>${product.name} - Bs. ${product.price}</span>
                <button onclick="editPrice(${index})">Editar</button>
            </div>
        `;
    });
}

function addProduct() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    if (name === "" || price === "") {
        alert("Completa todos los campos");
        return;
    }

    products.push({ name, price });
    renderProducts();

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
}

function editPrice(index) {
    const newPrice = prompt("Nuevo precio:");
    if (newPrice !== null) {
        products[index].price = newPrice;
        renderProducts();
    }
}



