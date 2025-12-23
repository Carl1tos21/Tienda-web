// La URL base de tu backend Flask (ejecutándose localmente)
const API_URL = 'http://127.0.0.1:5000/api/products'; 

// Ya no necesitamos la variable 'products = []' ni loadProducts/saveProducts

// --- Funciones de la Aplicación (Comunicación con el Backend) ---

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener los productos del servidor');
        }
        // Devuelve los datos como un arreglo de JavaScript
        return await response.json(); 
    } catch (error) {
        console.error("Fallo en la conexión al API:", error);
        return []; // Retorna un arreglo vacío en caso de fallo
    }
}

async function renderProducts() {
    const products = await fetchProducts(); // Obtiene la lista más reciente del servidor
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    
    if (products.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #777;">Aún no hay productos añadidos o el servidor está inactivo.</p>';
        return;
    }

    products.forEach((product) => {
        // Usamos product.id para la edición
        const price = parseFloat(product.price).toFixed(2);
        
        list.innerHTML += `
            <div class="product">
                <span>${product.name} - Bs. ${price}</span>
                <button onclick="editPrice(${product.id})">Editar</button>
            </div>
        `;
    });
}

async function addProduct() {
    const name = document.getElementById("name").value.trim();
    const priceInput = document.getElementById("price").value;
    const priceValue = parseFloat(priceInput);

    if (name === "" || isNaN(priceValue) || priceValue <= 0) {
        alert("Por favor, ingresa un nombre válido y un precio mayor a cero.");
        return;
    }
    
    // Datos a enviar al servidor (Backend)
    const newProductData = { 
        name: name, 
        price: priceValue.toFixed(2) // Envía con 2 decimales
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST', // Método para agregar datos
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProductData) // Envía el objeto JS como JSON
        });

        if (!response.ok) {
            throw new Error('No se pudo agregar el producto en el servidor');
        }

        // Si se agregó correctamente, volvemos a renderizar
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        renderProducts(); 
    } catch (error) {
        console.error("Fallo al agregar producto:", error);
        alert("Hubo un error al guardar el producto.");
    }
}

async function editPrice(id) {
    const newPricePrompt = prompt("Ingresa el nuevo precio (Bs.):");
    
    if (newPricePrompt !== null) {
        const newPriceValue = parseFloat(newPricePrompt);
        
        if (!isNaN(newPriceValue) && newPriceValue >= 0) {
            const updatedPriceData = {
                price: newPriceValue.toFixed(2)
            };
            
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT', // Método para actualizar datos
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedPriceData)
                });

                if (!response.ok) {
                    throw new Error('No se pudo actualizar el precio en el servidor');
                }

                // Si se actualizó correctamente, volvemos a renderizar
                renderProducts(); 
            } catch (error) {
                console.error("Fallo al actualizar precio:", error);
                alert("Hubo un error al actualizar el precio.");
            }

        } else {
            alert("Precio no válido. Debe ser un número positivo.");
        }
    }
}


// --- Inicialización (Llamada al cargar la página) ---

document.addEventListener('DOMContentLoaded', () => {
    // Al cargar la página, la app pide la lista al servidor
    renderProducts(); 
});
