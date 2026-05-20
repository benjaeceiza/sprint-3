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

    // 2. ORDENAR LOS PRODUCTOS
    if (sortQuery) {
        productosMostrar = productService.sortProducts(productosMostrar, sortQuery);
    }

    const categorias = productService.getCategories();

    // 3. Renderizamos la vista
    res.render('pages/productList', {
        products: productosMostrar,
        category: tituloCategoria,
        categorias: categorias,
        currentSort: sortQuery
    });
}


// VER DETALLE DE UN PRODUCTO (con validación de ID y manejo de errores)
const verDetalle = (req, res) => {
    const pid = req.params.id; 
    
    // --- PASO 1: Normalizamos y validamos contra la base de datos ---
    const validation = productService.normalizeId(pid);

    // Si el id es no numerico o negativo, mostramos un error 400 (Bad Request)
    if (validation.status === 400) {
        return res.status(400).render("pages/400");
    }

    // Si el producto no existe en la base de datos, mostramos un error 404 con productos recomendados
    if (validation.status === 404) {
        const todosLosProductos = productService.getAllProducts();
        const recomendados = productService.getRandomProducts(todosLosProductos, 4);
        const categorias = productService.getCategories();
        
        return res.status(404).render('pages/productoNoEncontrado', { 
            randomProducts: recomendados,
            categorias: categorias,
            randomProducts: productService.getRandomProducts(productService.getAllProducts(), 4)
        });
    }

    // --- PASO 2: Producto validado y encontrado ---

    const product = productService.getProductById(validation.id);
    const categorias = productService.getCategories();

    const productosMismaCategoria = productService.getProductsByCategory(product.categoria)
                                        .filter(p => p.id !== product.id);
    
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