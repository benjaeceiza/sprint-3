const db = require('../db/database.js'); // Asegurate de que la ruta a database.js sea correcta


// Normaliza y valida el ID del producto, asegurando que sea un número positivo y que exista en la base de datos
const normalizeId = (id) => {
    const parsedId = Number(id);

    // 1. Validar que sea un numero valido y positivo
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return { isValid: false, status: 400 };
    }

    // 2. Validar que el producto exista en la base de datos
    const exists = db.prepare('SELECT id FROM products WHERE id = ?').get(parsedId);

    if (!exists) {
        return { isValid: false, status: 404 };
    }

    // Si pasa ambas validaciones, retornamos el ID normalizado
    return { isValid: true, id: parsedId };
}

// Trae todos los productos desde la base de datos (con imagen agregada)
const getAllProducts = () => {
    const sql = `
        SELECT p.id, p.title AS name, p.description, p.price, p.stock, p.image, c.name AS categoria
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
    `;
    return db.prepare(sql).all();
}

// Busca productos por nombre en la base de datos (con imagen agregada)
const searchProducts = (searchTerm) => {
    if (!searchTerm) return [];

    const sql = `
        SELECT p.id, p.title AS name, p.description, p.price, p.stock, p.image, c.name AS categoria
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.title LIKE ?
    `;

    return db.prepare(sql).all(`%${searchTerm}%`);
};

// Busca un producto por ID en la base de datos
const getProductById = (id) => {

    // Forzamos a Number por seguridad 
    const safeId = Number(id); 

    const sql = `
        SELECT p.id, p.title AS name, p.description, p.price, p.stock, p.image, p.thumbnails, c.name AS categoria
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `;
    const product = db.prepare(sql).get(safeId);

    // Si encontramos el producto y tiene thumbnails en texto, lo parseamos a array
    if (product && product.thumbnails) {
        product.thumbnails = JSON.parse(product.thumbnails);
    }

    return product;
}

// Filtra por categoría en la base de datos (con imagen agregada)
const getProductsByCategory = (categoria) => {
    if (!categoria || categoria.toLowerCase() === 'all') {
        return getAllProducts();
    }

    const sql = `
        SELECT p.id, p.title AS name, p.description, p.price, p.stock, p.image, c.name AS categoria
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE LOWER(c.name) = LOWER(?)
    `;
    return db.prepare(sql).all(categoria);
}

// Extrae todas las categorías desde la base de datos (Corregido a description AS icon)
const getCategories = () => {
    const sql = `SELECT id, name, icon FROM categories`;
    return db.prepare(sql).all();
}

// -------------------------------------------------------------------------
// FUNCIONES DE UTILIDAD 
// -------------------------------------------------------------------------

// Trae productos de forma ascendente o descendente
const sortProducts = (productsArray, sortOrder) => {
    let sorted = [...productsArray];
    if (sortOrder === 'asc') {
        sorted.sort((a, b) => a.price - b.price); // Menor a Mayor
    } else if (sortOrder === 'desc') {
        sorted.sort((a, b) => b.price - a.price); // Mayor a Menor
    }
    return sorted;
};

// Trae productos aleatorios
const getRandomProducts = (productsArray, count = 4) => {
    const shuffled = [...productsArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getRandomProducts,
    getCategories,
    normalizeId,
    sortProducts,
    searchProducts
};