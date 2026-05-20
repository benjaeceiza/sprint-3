// migrate.js
const fs = require('fs');
const path = require('path');
const db = require('./database.js');


// 1. Leer el archivo JSON de categorias desde la carpeta 'data'
let categories = [];

try {
    const categoriesData = fs.readFileSync('src/data/categories.json', 'utf-8');
    categories = JSON.parse(categoriesData);
} catch (error) {
    console.error('❌ Error al leer categories.json. ¿Existe en la carpeta data?', error.message);
    process.exit(1);
}

// 2. Leer el archivo JSON de productos desde la carpeta 'data'
let products = [];

try {
    const productsData = fs.readFileSync('src/data/products.json', 'utf-8');
    products = JSON.parse(productsData);
} catch (error) {
    console.error('❌ Error al leer products.json. ¿Existe en la carpeta data?', error.message);
    process.exit(1);
}

// 3. Preparar las consultas con INSERT OR IGNORE
const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name, icon) 
    VALUES (?, ?, ?)
`);

const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (id, title, description, price, stock, image, thumbnails, category_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// 4. Ejecutar las inserciones dentro de una transacción
const runMigration = db.transaction(() => {

    // A. Migramos categorias
    for (const cat of categories) {
        insertCategory.run(cat.id, cat.name, cat.icon);
    }

    // B. Migramos productos
    for (const prod of products) {
        let catName = prod.categoria === 'alcohol' ? 'bebida' : prod.categoria;
        let foundCategory = categories.find(c => c.name === catName);
        let categoryId = foundCategory ? foundCategory.id : 8;

        insertProduct.run(
            prod.id,
            prod.name,
            prod.description,
            prod.price,
            prod.stock,
            prod.image,
            JSON.stringify(prod.thumbnails), // Convertimos el array a string 
            categoryId
        );
    }
});

// 5. Ejecutamos
try {
    runMigration();
    log('✅ Migración completada exitosamente. Categorías y productos insertados en SQLite.');
} catch (error) {
    console.error('❌ Ocurrió un error en la migración:', error);
}