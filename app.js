
const express = require("express");
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const port = 3000;

const app = express();
const path = require('path');
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(expressLayouts); 
app.set('layout', 'layouts/main'); 


const categorias = require("./src/data/categories.json");
const products = require("./src/data/products.json");
const authRouter = require('./src/routes/auth.router');
const productRouter = require('./src/routes/product.router');
const cartRouter = require('./src/routes/cart.router');
const db = require('./src/db/database.js');


app.use(session({
    secret: 'clave_123',
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

//Contador de productos del carrito
app.use((req, res, next) => {
   
    let cantidadTotal = 0;

    if (req.session && req.session.cart) {
        cantidadTotal = req.session.cart.reduce((acumulador, item) => {
            return acumulador + item.quantity;
        }, 0);
    }

  
    res.locals.cantidadTotalCarrito = cantidadTotal;

    next();
});


//Página de pago
app.get('/checkout',
    (req, res) => res.render('pages/checkout')
);

app.get('/', (req, res) => res.render('pages/index', { categorias, products }));

app.get("/categories/:category", (req,res) => {

    const {category} = req.params;

    res.render("pages/categoriesFiltred",{products,category,categorias})
})




app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);


app.use((req, res) => {
    res.status(404).render("pages/404");
});

app.use((err, req, res, next) => {
    console.error('ERROR DETECTADO:', err.stack);

    res.status(500).render('pages/500');
})

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});