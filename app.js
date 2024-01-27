const express = require("express");
const bodyParser = require('body-parser');
const GestionProductos = require("./GestionProductos.js");

const app = express();
const port = 8080;

app.use(express.json())
const gestion = new GestionProductos('./productos.json', './carrito.json');

// Ruta para mostrar todos los productos con límite opcional
app.get("/productos", (req, res) => {
    const limit = parseInt(req.query.limit);
    
    if (limit && limit > 0) {
        const productosLimitados = gestion.mostrarProductos().slice(0, limit);
        res.json({ message: `Lista de primeros ${limit} productos`, productos: productosLimitados });
    } else {
        res.json({ message: "Lista de todos los productos", productos: gestion.mostrarProductos() });
    }
});

// Ruta para mostrar un producto por ID
app.get("/productos/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const producto = gestion.mostrarProducto(productId);

    if (producto) {
        res.json({ message: "Detalles del producto", producto });
    } else {
        res.status(404).json({ message: "Producto no encontrado" });
    }
});

// Ruta para agregar un nuevo producto (POST)
app.post("/productos", (req, res) => {
    const datosProducto = req.body; // Obtener datos del cuerpo de la solicitud

    // Llamar al método de la clase GestionProductos para agregar el producto
    gestion.añadirProducto(datosProducto);

    res.json({ message: "Producto agregado con éxito", producto: datosProducto });
});

// Ruta para actualizar un campo específico del producto por ID
app.put("/productos/:id", (req, res) => {
    const productoId = parseInt(req.params.id);
    const { campo, nuevoValor } = req.body;

    gestion.actualizarProducto({ productoId, campo, nuevoValor });

    res.json({ message: "Campo del producto actualizado exitosamente" });
});

// Ruta para borrar un producto por ID
app.delete("/productos/:id", (req, res) => {
    const productoId = parseInt(req.params.id);

    gestion.borrarProducto(productoId);

    res.json({ message: "Producto eliminado exitosamente" });
});

// Ruta para crear un nuevo carrito
app.post("/carts", (req, res) => {
    const products = req.body.products || []; // Obtener el array de productos desde el cuerpo de la solicitud

    const nuevoCarrito = gestion.crearNuevoCarrito(products);

    res.json({ message: "Nuevo carrito creado", cart: nuevoCarrito });
});

// Ruta para mostrar productos de un carrito por ID
app.get("/carts/:id", (req, res) => {
    const carritoId = parseInt(req.params.id);
    const productosEnCarrito = gestion.mostrarProductosDeCarrito(carritoId);

    res.json({ message: `Productos en el carrito con ID ${carritoId}`, products: productosEnCarrito });
});

// Ruta para agregar un porducto a un carrito
app.post("/carts/:id/product/:idProducto", (req, res) => {
    const carritoId = parseInt(req.params.id);
    const productoId = parseInt(req.params.idProducto);

    // Llama al método para agregar el producto al carrito
    gestion.agregarProductoAlCarrito(carritoId, productoId);

    res.json({ message: `Producto con ID ${productoId} agregado al carrito ${carritoId} correctamente.` });
});

app.listen(port, () => {
    console.log(`Servidor Express iniciado en http://localhost:${port}`);
});