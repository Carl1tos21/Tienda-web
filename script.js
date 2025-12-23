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

// --- Funciones de la Aplicación ---

function renderProducts() {
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    
    // Si no hay productos, mostrar un mensaje
    if (products.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #777;">Aún no hay productos añadidos.</p>';
        return; // Salir de la función
    }

    products.forEach((product, index) => {
        // Formatea el precio a dos decimales de manera segura
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
    const priceInput = document.getElementById("price").value;
    const priceValue = parseFloat(priceInput);

    // Validación de campos
    if (name === "" || isNaN(priceValue) || priceValue <= 0) {
        alert("Por favor, ingresa un nombre válido y un precio mayor a cero.");
        return;
    }
    
    // Almacena el precio como cadena con 2 decimales para consistencia
    const price = priceValue.toFixed(2);

    products.push({ name, price });
    
    // 1. Renderiza la lista actualizada
    renderProducts();
    
    // 2. Guarda la lista actualizada para la persistencia
    saveProducts();

    // Limpiar los campos de entrada
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
}

function editPrice(index) {
    const currentPrice = products[index].price;
    const newPricePrompt = prompt("Ingresa el nuevo precio (Bs.):", currentPrice);
    
    if (newPricePrompt !== null) {
        const newPriceValue = parseFloat(newPricePrompt);
        
        if (!isNaN(newPriceValue) && newPriceValue >= 0) {
            // Guarda el nuevo precio como cadena con 2 decimales
            products[index].price = newPriceValue.toFixed(2);
            
            // 1. Renderiza la lista actualizada
            renderProducts();
            
            // 2. Guarda la lista actualizada para la persistencia
            saveProducts();
        } else {
            alert("Precio no válido. Debe ser un número positivo.");
        }
    }
}


// --- Inicialización (Ejecución al cargar la página) ---

// Este evento asegura que el código se ejecuta solo cuando el DOM está listo,
// garantizando que 'product-list' y otros elementos existan antes de ser manipulados.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Carga los datos guardados (si existen)
    loadProducts();

    // 2. Muestra los productos cargados
    renderProducts();
});


