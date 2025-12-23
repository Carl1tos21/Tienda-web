from flask import Flask, jsonify, request
from flask_cors import CORS # Necesario para permitir la comunicación entre tu frontend (GitHub Pages) y el backend

app = Flask(__name__)
# Configura CORS para permitir peticiones desde cualquier origen (necesario para el desarrollo)
CORS(app) 

# --- Base de Datos en Memoria (Simulando una DB) ---
# Inicializamos la lista de productos con un ID único
products = [
    {"id": 1, "name": "Leche", "price": 8.50},
    {"id": 2, "name": "Pan Integral", "price": 12.00},
]
next_id = 3 # Contador para asignar el próximo ID

# --- Rutas de la API ---

@app.route('/api/products', methods=['GET'])
def get_products():
    """Ruta para obtener todos los productos."""
    # Retorna la lista completa de productos como JSON
    return jsonify(products)

@app.route('/api/products', methods=['POST'])
def add_product_api():
    """Ruta para agregar un nuevo producto."""
    global next_id
    
    # Obtener los datos JSON de la petición (enviados desde el frontend)
    new_data = request.json
    
    if not new_data or 'name' not in new_data or 'price' not in new_data:
        return jsonify({"error": "Datos incompletos o inválidos"}), 400

    # Crear el nuevo producto con el ID
    new_product = {
        "id": next_id,
        "name": new_data['name'],
        "price": float(new_data['price'])
    }
    
    products.append(new_product)
    next_id += 1
    
    # Retornar el producto creado y código 201 (Creado)
    return jsonify(new_product), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product_price(product_id):
    """Ruta para actualizar el precio de un producto por su ID."""
    new_data = request.json
    
    if 'price' not in new_data:
        return jsonify({"error": "Falta el campo 'price'"}), 400

    # Buscar el producto por ID
    product_found = None
    for product in products:
        if product['id'] == product_id:
            product_found = product
            break
            
    if product_found:
        # Actualizar el precio
        product_found['price'] = float(new_data['price'])
        return jsonify(product_found)
    else:
        return jsonify({"error": "Producto no encontrado"}), 404

# --- Ejecución del Servidor ---

if __name__ == '__main__':
    # El servidor se ejecuta en el puerto 5000 por defecto
    app.run(debug=True)