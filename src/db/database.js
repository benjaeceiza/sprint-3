const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// 1. Inicializamos la base de datos 
const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new Database(dbPath, { verbose: console.log }); // 'verbose' te imprime las consultas en consola para debuggear

// 2. Leemos el archivo schema.sql
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// 3. Ejecutamos el schema completo. 
try {
    db.exec(schema);
    console.log('✅ Base de datos SQLite inicializada correctamente.');
} catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
}

// 4. Exportamos la conexión 
module.exports = db;