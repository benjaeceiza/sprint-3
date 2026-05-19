

const express = require('express');
const router = express.Router();

module.exports = router;


//Página de registro para new users (register.ejs)
router.get('/register',
    (req, res) => res.render('pages/register',{ layout: false })
);


router.post('/register', (req, res) => {

    const { name, lastname, email, password, confirmPassword } = req.body;

    const user = {
         name,
         lastname,
         email
    }

    res.status(200).json({ message: 'Validación exitosa. Listo para crear el usuario.', user });
});


//Página de inicio de sesión (login.ejs)
router.get('/login',
    (req, res) => res.render('pages/login',{ layout: false })
);


router.use((req, res) => {
    res.status(404).send("Página no encontrada");
});