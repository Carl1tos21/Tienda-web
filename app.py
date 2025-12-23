from flask import Flask, jsonify, request
from flask_cors import CORS 

app = Flask(__name__)
# Permitimos CORS para que GitHub Pages pueda comunicarse con la API
CORS(app) 

# --- Base de Datos en Memoria (Simulando una DB) ---
# OJO: Los datos se reinician cada vez que Render reinicia la aplicación (cada 5-15 minutos).
# Para una solución permanente, se necesitaría PostgreSQL o MongoDB.
products = [
    {"id": 1, "name": "Leche", "price": 8.50},
    {"id": 2, "name": "Pan Integral", "price": 12.00},
]
next_id = 3

# --- Rutas de la API ---

@app.route('/api/products', methods=['GET'])
def get_products():
    """Ruta para obtener todos los productos."""
    return jsonify(products)

@app.route('/api/products', methods=['POST'])
def add_product_api():
    """Ruta para agregar un nuevo producto."""
    global next_id
    
    new_data = request.json
    
    if not new_data or 'name' not in new_data or 'price' not in new_data:
        return jsonify({"error": "Datos incompletos o inválidos"}), 400

    new_product = {
        "id": next_id,
        "name": new_data['name'],
        "price": float(new_data['price'])
    }
    
    products.append(new_product)
    next_id += 1
    
    return jsonify(new_product), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product_price(product_id):
    """Ruta para actualizar el precio de un producto por su ID."""
    new_data = request.json
    
    if 'price' not in new_data:
        return jsonify({"error": "Falta el campo 'price'"}), 400

    product_found = None
    for product in products:
        if product['id'] == product_id:
            product_found = product
            break
            
    if product_found:
        product_found['price'] = float(new_data['price'])
        return jsonify(product_found)
    else:
        return jsonify({"error": "Producto no encontrado"}), 404

# NOTA: No hay bloque if __name__ == '__main__': aquí. Gunicorn ejecuta la app.
