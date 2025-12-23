let products = [];

// --- Funciones para Guardar y Cargar ---

/**
 * Guarda el arreglo 'products' en localStorage.
 */
function saveProducts() {
    // Convierte el arreglo JavaScript a una cadena JSON
    localStorage.setItem('storedProducts', JSON.stringify(products));
}

/**
 * Carga los productos desde localStorage al inicio.
 */
function loadProducts() {
    // Obtiene la cadena JSON de localStorage
    const stored = localStorage.getItem('storedProducts');
    if (stored) {
        // Convierte la cadena JSON de vuelta a un arreglo JavaScript
        products = JSON.parse(stored);
    }
}

// --- Funciones Existentes Modificadas ---

function renderProducts() {
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    

    products.forEach((product, index) => {
        // Asegúrate de que el precio sea tratado como número (aunque se almacene como texto)
        const price = parseFloat(product.price).toFixed(2); 
        list.innerHTML += `
            <div class="product">
                <span>${product.name} - Bs. ${price}</span>
                <button onclick="editPrice(${index})">Editar</button>
            </div>
        `;
    });
}

function addProduct() {
    const name = document.getElementById("name").value.trim();
    // Obtener el valor y convertirlo a un número con 2 decimales
    const priceValue = parseFloat(document.getElementById("price").value);

    if (name === "" || isNaN(priceValue) || priceValue <= 0) {
        alert("Por favor, completa un nombre válido y un precio mayor a cero.");
        return;
    }
    
    // Almacena el precio como cadena con 2 decimales para consistencia
    const price = priceValue.toFixed(2); 

    products.push({ name, price });
    
    // 1. Renderiza la lista actualizada
    renderProducts();
    
    // 2. ¡Guarda la lista actualizada!
    saveProducts();

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
}

function editPrice(index) {
    // Usamos el precio actual como valor por defecto en el prompt
    const currentPrice = products[index].price;
    const newPricePrompt = prompt("Nuevo precio:", currentPrice);
    
    if (newPricePrompt !== null) {
        // Validamos la entrada
        const newPriceValue = parseFloat(newPricePrompt);
        
        if (!isNaN(newPriceValue) && newPriceValue >= 0) {
            // Guarda el nuevo precio como cadena con 2 decimales
            products[index].price = newPriceValue.toFixed(2);
            
            // 1. Renderiza la lista actualizada
            renderProducts();
            
            // 2. ¡Guarda la lista actualizada!
            saveProducts();
        } else {
            alert("Precio no válido. Debe ser un número positivo.");
        }
    }
}


// --- Inicialización (Llamada al cargar la página) ---

// 1. Carga los datos guardados (si existen)
loadProducts();

// 2. Muestra los productos cargados
renderProducts();



