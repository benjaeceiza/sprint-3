const productsService = require('./productsService'); 

const agregarItem = (cart, productId, quantity) => {

    // 1. Validamos que el producto realmente exista en la base de datos
    const productoReal = productsService.getProductById(productId);
    
    // Si alguien intenta meter un ID falso, lo ignora
    if (!productoReal) return cart; 

    // Convertimos a String para evitar bugs de comparación entre números y textos
    const indice = cart.findIndex(p => String(p.productId) === String(productId));

    if (indice !== -1) {
        cart[indice].quantity += parseInt(quantity);
    } else {
        cart.push({
            productId: productId,
            quantity: parseInt(quantity)
        });
    }
    return cart;
};

// Para sumar una unidad al carrito
const sumarUnidad = (cart, productId) => {
    const indice = cart.findIndex(p => String(p.productId) === String(productId));
    if (indice !== -1) {
        cart[indice].quantity += 1;
    }
    return cart;
};


// Para restar una unidad al carrito
const restarUnidad = (cart, productId) => {
    const indice = cart.findIndex(p => String(p.productId) === String(productId));
    if (indice !== -1) {
        cart[indice].quantity -= 1;
        if (cart[indice].quantity <= 0) {
            cart.splice(indice, 1);
        }
    }
    return cart;
};

// Para eliminar un producto completamente del carrito
const eliminarItem = (cart, productId) => {
    return cart.filter(p => String(p.productId) !== String(productId));
};

// Para obtener el detalle del carrito con precios actualizados desde la base de datos
const obtenerDetalleCarrito = (cartSession) => {
    let total = 0;

    const cartDetallado = cartSession.map(item => {
        // 2. Buscamos el precio y datos actualizados directo desde SQLite
        const productoReal = productsService.getProductById(item.productId);

        // Si el producto sigue existiendo en la BD, lo procesamos
        if (productoReal) {
            const subtotal = productoReal.price * item.quantity;
            total += subtotal;

            return {
                id: productoReal.id,
                nombre: productoReal.name,
                precio: productoReal.price, 
                imagen: productoReal.image || 'https://st2.depositphotos.com/2586633/46477/v/950/depositphotos_464771766-stock-illustration-no-photo-or-blank-image.jpg',
                cantidad: item.quantity,
                subtotal: subtotal
            };
        }
        
        // Si el producto fue borrado de la BD pero seguía en la sesión, retornamos null
        return null; 
    }).filter(item => item !== null); // Limpiamos los nulos

    return { cartDetallado, total };
};

module.exports = {
    agregarItem,
    sumarUnidad,
    restarUnidad,
    eliminarItem,
    obtenerDetalleCarrito
};