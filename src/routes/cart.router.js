const express = require('express');
const router = express.Router();

module.exports = router;

const { verCarrito, agregarProducto, sumarCantidad, restarCantidad, eliminarProducto, vaciarCarrito } = require('../controllers/cart.controller');

router.get('/', verCarrito);

// Agregar desde la vista de productos
router.post('/agregar', agregarProducto);

router.post('/increase/:id', sumarCantidad);
router.post('/decrease/:id', restarCantidad);
router.post('/delete/:id', eliminarProducto);

// Vaciar carrito completo
router.post('/vaciar', vaciarCarrito);

router.use((req, res) => {
    res.status(404).send("Página no encontrada");
});