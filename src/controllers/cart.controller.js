
const cartService = require('../services/cartService');

// AGREGAR UN PRODUCTO
const agregarProducto = (req, res) => {
    const { productId, quantity } = req.body;

    if (!req.session.cart) req.session.cart = [];

    req.session.cart = cartService.agregarItem(req.session.cart, productId, quantity);

    res.redirect('/cart');
}

// MODIFICAR CANTIDAD
const sumarCantidad = (req, res) => {
    const productId = req.params.id;
    if (!req.session.cart) return res.redirect('/cart');

    req.session.cart = cartService.sumarUnidad(req.session.cart, productId);
    res.redirect('/cart');
}

const restarCantidad = (req, res) => {
    const productId = req.params.id;
    if (!req.session.cart) return res.redirect('/cart');

    req.session.cart = cartService.restarUnidad(req.session.cart, productId);
    res.redirect('/cart');
}

// ELIMINAR PRODUCTO
const eliminarProducto = (req, res) => {
    const productId = req.params.id;
    if (!req.session.cart) return res.redirect('/cart');

    req.session.cart = cartService.eliminarItem(req.session.cart, productId);
    res.redirect('/cart');
}

// PARA VACIAR EL CARRITO 
const vaciarCarrito = (req, res) => {
    req.session.cart = [];
    res.redirect('/cart');
}

// PARA VER EL CARRITO
const verCarrito = (req, res) => {
    const cartSession = req.session.cart || [];
    
    // Le pedimos al servicio que nos arme los detalles y calcule el total
    const { cartDetallado, total } = cartService.obtenerDetalleCarrito(cartSession);

    // Renderizamos enviando lo que nos devolvió el servicio
    res.render('pages/cart', { cart: cartDetallado, totalGeneral: total });
}



module.exports = {
    verCarrito,
    vaciarCarrito,
    sumarCantidad,
    restarCantidad,
    eliminarProducto,
    agregarProducto,
}