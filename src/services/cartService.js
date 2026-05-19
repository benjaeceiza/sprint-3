// El servicio es el encargado de interactuar con los datos (el JSON en este caso)
const productos = require("../data/products.json");

const agregarItem = (cart, productId, quantity) => {
    const indice = cart.findIndex(p => p.productId === productId);

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

const sumarUnidad = (cart, productId) => {
    const indice = cart.findIndex(p => p.productId === productId);
    if (indice !== -1) {
        cart[indice].quantity += 1;
    }
    return cart;
};

const restarUnidad = (cart, productId) => {
    const indice = cart.findIndex(p => p.productId === productId);
    if (indice !== -1) {
        cart[indice].quantity -= 1;
        if (cart[indice].quantity <= 0) {
            cart.splice(indice, 1);
        }
    }
    return cart;
};

const eliminarItem = (cart, productId) => {
    return cart.filter(p => p.productId !== productId);
};

const obtenerDetalleCarrito = (cartSession) => {
    let total = 0;

    const cartDetallado = cartSession.map(item => {
        const productoReal = productos.find(p => String(p.id) === String(item.productId));

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
        return null;
    }).filter(item => item !== null);

    return { cartDetallado, total };
};

module.exports = {
    agregarItem,
    sumarUnidad,
    restarUnidad,
    eliminarItem,
    obtenerDetalleCarrito
};