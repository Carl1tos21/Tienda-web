document.addEventListener('DOMContentLoaded', () => {
    const editorPanel = document.getElementById('editor-panel');
    const toggleButton = document.getElementById('toggle-editor');
    const productForm = document.getElementById('product-form');

    // ** LÓGICA DE INTERFAZ **

    // Función para mostrar/ocultar el panel de edición
    toggleButton.addEventListener('click', () => {
        editorPanel.classList.toggle('hidden');
        if (editorPanel.classList.contains('hidden')) {
            toggleButton.textContent = 'Modo Edición';
        } else {
            toggleButton.textContent = 'Ocultar Editor';
        }
    });

    // ** LÓGICA DE EDICIÓN FUTURA **
    
    // 1. Manejar el envío del formulario (futuro: guardar en base de datos)
    productForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue

        const productId = document.getElementById('product-id').value;
        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;
        const descripcion = document.getElementById('descripcion').value;

        console.log("--- DATOS A GUARDAR ---");
        console.log(`ID: ${productId || 'Nuevo'}`);
        console.log(`Nombre: ${nombre}`);
        console.log(`Precio: ${precio}`);
        console.log(`Descripción: ${descripcion}`);
        console.log("-----------------------");

        alert('Datos listos para ser guardados. (Aún no hay conexión a base de datos)');

        // Futuro: Aquí se llamará a la función de Firebase/Supabase para guardar los datos.
        
        // Limpiar formulario después de guardar
        productForm.reset();
        editorPanel.classList.add('hidden'); // Ocultar después de guardar
        toggleButton.textContent = 'Modo Edición';
    });

    // 2. Manejar el clic en el botón 'Editar' de un producto
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.producto-card');
            
            // Simulación de carga de datos para editar
            const id = card.getAttribute('data-id');
            const nombre = card.querySelector('.producto-nombre').textContent;
            const precio = card.querySelector('.producto-precio').textContent.replace('$ ', '');
            const desc = card.querySelector('.producto-desc').textContent;

            // Rellenar el formulario
            document.getElementById('product-id').value = id;
            document.getElementById('nombre').value = nombre;
            document.getElementById('precio').value = parseFloat(precio);
            document.getElementById('descripcion').value = desc;
            document.getElementById('save-button').textContent = 'Actualizar Producto';

            // Mostrar el panel de edición
            editorPanel.classList.remove('hidden');
            toggleButton.textContent = 'Ocultar Editor';
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Mover la vista al formulario
        });
    });

    // Futuro: Aquí se agrega el código para LEER los productos de Firebase/Supabase.
});

