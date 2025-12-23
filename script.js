// ======================================================================
// !!! IMPORTANTE: REEMPLAZA ESTA URL CON LA QUE TE DE EL SERVIDOR RENDER !!!
// EJEMPLO: https://tienda-api-compartida-xyz.onrender.com
// ======================================================================
const BASE_API_URL = 'https://[TU-URL-PUBLICA-DE-RENDER].onrender.com'; 
const API_URL = `${BASE_API_URL}/api/products`; 


// --- Funciones de la Aplicación (Comunicación con el Backend) ---

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            // Este error ocurrirá si la URL de Render es incorrecta o el servidor está durmiendo.
            throw new Error(`Error ${response.status}: Fallo al obtener productos.`);
        }
        return await response.json(); 
    } catch (error) {
        console.error("Fallo en la conexión al API:", error);
        return []; 
    }
}

async function renderProducts() {
    const products = await fetchProducts(); 
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    
    if (products.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #777;">Aún no hay productos añadidos o el servidor (API) está inactivo.</p>';
        return;
    }

    products.forEach((product) => {
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
    
    const newProductData = { 
        name: name, 
        price: priceValue.toFixed(2)
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProductData) 
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo agregar el producto.`);
        }

        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        renderProducts(); 
    } catch (error) {
        console.error("Fallo al agregar producto:", error);
        alert("Hubo un error al guardar el producto. ¿Está la API de Render activa?");
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
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedPriceData)
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: No se pudo actualizar el precio.`);
                }

                renderProducts(); 
            } catch (error) {
                console.error("Fallo al actualizar precio:", error);
                alert("Hubo un error al actualizar el precio. ¿Está la API de Render activa?");
            }

        } else {
            alert("Precio no válido. Debe ser un número positivo.");
        }
    }
}


// --- Inicialización (Llamada al cargar la página) ---

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(); 
});
