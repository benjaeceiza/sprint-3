const products = require('../data/products.json');
const categories = require("../data/categories.json")


const normalizeId = (id) => {
  
    const parsedId = Number(id);

    if (Number.isInteger(parsedId) && parsedId > 0) {
        return parsedId; 
    }
    return null;

}

// Trae todos los productos
const getAllProducts = () => {
    return products;
}

const searchProducts = (searchTerm) => {
    if (!searchTerm) return []; 
    
    const terminoMinusc = searchTerm.toLowerCase();
    
    return products.filter(product => 
        product.name.toLowerCase().includes(terminoMinusc)
    );
};

// Busca un producto por ID 
const getProductById = (id) => {
    return products.find(product => product.id === id);
}

// Filtra por categoría
const getProductsByCategory = (categoria) => {

    if (!categoria || categoria === 'all') return products;

    return products.filter(product => product.categoria.toLowerCase() === categoria.toLowerCase());
}

// Extrae todas las categorías 
const getCategories = () => {
    return categories;
}

//Trae productos de forma ascendente o descendente
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