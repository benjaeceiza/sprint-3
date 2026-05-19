const express = require('express');
const router = express.Router();


const productController = require('../controllers/product.controller');



// Ruta para ver el listado de productos completo o filtrado

router.get('/', productController.verListado);

// Ruta para buscar productos por su nombre
router.get('/search', productController.buscarProductos);

// Ruta para ver el detalle de un producto específico
router.get('/:id', productController.verDetalle);


module.exports = router;