const express = require("express");
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

// --- IMPORTACIONES LOCALES ---
const db = require('./src/db/database.js'); 
const productsService = require('./src/services/productsService.js'); 

// Routers
const authRouter = require('./src/routes/auth.router');
const productRouter = require('./src/routes/product.router');
const cartRouter = require('./src/routes/cart.router');

const app = express();
const port = 3000;

// --- CONFIGURACIÓN DE MOTOR DE VISTAS ---
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(expressLayouts); 
app.set('layout', 'layouts/main'); 

// --- MIDDLEWARES GLOBALES ---
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'clave_123',
    resave: false,
    saveUninitialized: false,
}));

// Variables locales para todas las vistas (Sesión)
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Contador de productos del carrito optimizado
app.use((req, res, next) => {
    let cantidadTotal = 0;
    // Usamos ?. (Optional Chaining) para que sea más limpio
    if (req.session?.cart) {
        cantidadTotal = req.session.cart.reduce((acumulador, item) => acumulador + item.quantity, 0);
    }
    res.locals.cantidadTotalCarrito = cantidadTotal;
    next();
});

// --- RUTAS PRINCIPALES ---
// Página de inicio: Ahora trae productos y categorías de SQLite
app.get('/', (req, res) => {
    const categorias = productsService.getCategories();
    const products = productsService.getAllProducts();
    
    res.render('pages/index', { categorias, products });
});

// Página de categorías filtradas
app.get("/categories/:category", (req, res) => {
    const { category } = req.params;
    
    const categorias = productsService.getCategories();
    const products = productsService.getProductsByCategory(category);
    
    res.render("pages/categoriesFiltred", { products, category, categorias });
});

// Pagina de pago
app.get('/checkout', (req, res) => res.render('pages/checkout'));

// --- RUTAS DE ROUTERS ---
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);

// 404 - Página no encontrada
app.use((req, res) => {
    res.status(404).render("pages/404");
});

// 500 - Error del servidor
app.use((err, req, res, next) => {
    console.error('ERROR DETECTADO:', err.stack);
    res.status(500).render('pages/500');
});

// --- INICIO DEL SERVIDOR ---
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});