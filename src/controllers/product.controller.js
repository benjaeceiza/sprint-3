const productService = require('../services/productsService');

const verListado = (req, res) => {

    // Atrapamos la Query si es que hay
    const categoriaQuery = req.query.categoria; 
    const sortQuery = req.query.sort; 
    const searchQuery = req.query.search; 
    
    let productosMostrar = [];
    let tituloCategoria = 'Todos los productos';

    // 1. Filtrar por categoría
    if (categoriaQuery && categoriaQuery !== 'all') {
        productosMostrar = productService.getProductsByCategory(categoriaQuery);
        tituloCategoria = categoriaQuery;
    } else {
        productosMostrar = productService.getAllProducts();
        tituloCategoria = 'all';
    }

    // 2. ORDENAR LOS PRODUCTOS (La magia sucede acá)
    if (sortQuery) {
        productosMostrar = productService.sortProducts(productosMostrar, sortQuery);
    }

    const categorias = productService.getCategories();

    // 3. Renderizamos la vista y le pasamos el currentSort
    res.render('pages/productList', { 
        products: productosMostrar, 
        category: tituloCategoria,
        categorias: categorias,
        currentSort: sortQuery 
    });
}

// 2. VER DETALLE DE UN PRODUCTO (Con normalización de ID - US#17)
const verDetalle = (req, res) => {
    const rawId = req.params.id; // Agarramos el ID tal cual viene en la URL
    
    // --- PASO 1: Normalizamos el ID ---
    const validId = productService.normalizeId(rawId);

    // ESCENARIO 1: ID no numérico -> 400
    if (validId === null) {
        return res.status(400).render("pages/400");
    }

    // --- PASO 2: Buscamos el producto con el ID validado ---
    const product = productService.getProductById(validId);
    const categorias = productService.getCategories();

    // ESCENARIO 2: ID numérico pero inexistente -> 404
    if (!product) {
        const todosLosProductos = productService.getAllProducts();
        const recomendados = productService.getRandomProducts(todosLosProductos, 4);
        
        return res.status(404).render('pages/productoNoEncontrado', { 
            randomProducts: recomendados,
            categorias: categorias 
        });
    }

    // --- PASO 3: Producto encontrado ---
    // Si el producto existe, buscamos relacionados 
    const productosMismaCategoria = productService.getProductsByCategory(product.categoria)
                                        .filter(p => p.id !== product.id);
    
    // Sacamos 4 al azar para la sección de "Te puede interesar"
    const productosRelacionados = productService.getRandomProducts(productosMismaCategoria, 4);
    
    res.render('pages/product', {
        product: product,
        products: productosRelacionados, 
        categorias
    });
}

const buscarProductos = (req, res) => {
    const queryBuscada = req.query.query || '';
    const sortQuery = req.query.sort; 

  
    let productosEncontrados = productService.searchProducts(queryBuscada);

   
    if (sortQuery) {
        productosEncontrados = productService.sortProducts(productosEncontrados, sortQuery);
    }

    const categorias = productService.getCategories();

 
    res.render('pages/productList', { 
        products: productosEncontrados, 
        category: `Resultados para: "${queryBuscada}"`, 
        categorias: categorias,
        currentSort: sortQuery,
        searchQuery: queryBuscada 
    });
}

module.exports = {
    verListado,
    verDetalle,
    buscarProductos
}