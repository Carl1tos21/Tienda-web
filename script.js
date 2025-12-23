// OJO: Ya no usamos const API_URL. La variable 'db' se define en index.html

// --- Funciones de la Aplicación (Comunicación con Firebase) ---

/**
 * Establece un oyente en tiempo real para la colección 'products'.
 * Esto se ejecuta inmediatamente al cargar y cada vez que la colección cambia.
 */
function renderProducts() {
    const list = document.getElementById("product-list");

    // db.collection('products') es el nombre de la colección que contendrá tus productos
    db.collection("products").orderBy("name").onSnapshot((querySnapshot) => {
        list.innerHTML = ""; // Limpiar la lista antes de volver a renderizar
        
        if (querySnapshot.empty) {
            list.innerHTML = '<p style="text-align: center; color: #777;">Aún no hay productos añadidos.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const id = doc.id; // Usamos el ID de Firestore para editar

            const price = parseFloat(product.price).toFixed(2);
            
            list.innerHTML += `
                <div class="product">
                    <span>${product.name} - Bs. ${price}</span>
                    <button onclick="editPrice('${id}', '${product.name}')">Editar</button>
                </div>
            `;
        });
    }, (error) => {
        console.error("Error al obtener productos de Firestore:", error);
        list.innerHTML = '<p style="text-align: center; color: red;">Error de conexión con la base de datos.</p>';
    });
}

/**
 * Agrega un nuevo producto a la colección 'products' en Firebase.
 */
function addProduct() {
    const name = document.getElementById("name").value.trim();
    const priceInput = document.getElementById("price").value;
    const priceValue = parseFloat(priceInput);

    if (name === "" || isNaN(priceValue) || priceValue <= 0) {
        alert("Por favor, ingresa un nombre válido y un precio mayor a cero.");
        return;
    }
    
    const newProductData = { 
        name: name, 
        price: priceValue.toFixed(2), // Guardamos como string con 2 decimales
        created: firebase.firestore.FieldValue.serverTimestamp() // Opcional: marca de tiempo
    };

    // Usamos .add() para que Firestore genere el ID automáticamente
    db.collection("products").add(newProductData)
    .then(() => {
        // Éxito: limpiar los campos (renderProducts ya se encargará de actualizar la lista)
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
    })
    .catch((error) => {
        console.error("Error al agregar producto:", error);
        alert("Hubo un error al guardar el producto en la base de datos.");
    });
}

/**
 * Actualiza el precio de un producto usando su ID de Firestore.
 */
function editPrice(id, name) {
    const newPricePrompt = prompt(`Ingresa el nuevo precio (Bs.) para ${name}:`);
    
    if (newPricePrompt !== null) {
        const newPriceValue = parseFloat(newPricePrompt);
        
        if (!isNaN(newPriceValue) && newPriceValue >= 0) {
            const updatedPriceData = {
                price: newPriceValue.toFixed(2)
            };
            
            // Usamos .doc(id).update() para modificar solo el campo 'price'
            db.collection("products").doc(id).update(updatedPriceData)
            .then(() => {
                // Éxito: la función renderProducts se encarga de actualizar la lista en tiempo real.
            })
            .catch((error) => {
                console.error("Error al actualizar precio:", error);
                alert("Hubo un error al actualizar el precio en la base de datos.");
            });

        } else {
            alert("Precio no válido. Debe ser un número positivo.");
        }
    }
}


// --- Inicialización (Llamada al cargar la página) ---

document.addEventListener('DOMContentLoaded', () => {
    // Al cargar la página, la app establece el oyente de tiempo real
    // (renderProducts ya incluye la lógica de carga inicial)
    renderProducts(); 
});

