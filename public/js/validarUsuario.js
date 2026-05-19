const form = document.getElementById('registerForm');

form.addEventListener('submit', function (event) {

    event.preventDefault();

    // 2. Limpiamos errores previos en la pantalla
    document.querySelectorAll('.error-text').forEach(el => el.innerText = '');

    // 3. Capturamos los valores
    const name = document.getElementById('name').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let hasErrors = false;

    //Validaciones

    if (!name) {
        document.getElementById('message-error').innerText = 'El nombre no puede estar en blanco.';
        hasErrors = true;
        return;
    }

    if (!lastname) {
        document.getElementById('message-error').innerText = 'El apellido no puede estar en blanco.';
        hasErrors = true;
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('message-error').innerText = 'Ingresá un email válido.';
        hasErrors = true;
        return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const forbiddenStrings = ['password', '1234', 'qwerty', 'nombre_del_sitio', name.toLowerCase()];
    const containsForbidden = forbiddenStrings.some(str => password.toLowerCase().includes(str));

    if (password.length < 8) {
        document.getElementById('message-error').innerText = 'La contraseña debe tener al menos 8 caracteres';
        hasErrors = true;
        return
    }
    if (!hasLetter) {
        document.getElementById('message-error').innerText = 'La contraseña debe tener al menos 1 letra';
        hasErrors = true;
        return
    }
    if (!hasNumber) {
        document.getElementById('message-error').innerText = 'La contraseña debe tener al menos 1 número';
        hasErrors = true;
        return
    }
    if (!hasSpecialChar) {
        document.getElementById('message-error').innerText = 'La contraseña debe tener al menos 1 caracter especial';
        hasErrors = true;
        return
    }
    if (password === email) {
        document.getElementById('message-error').innerText = 'La contraseña debe ser distinta al email';
        hasErrors = true;
        return
    }
    if (containsForbidden) {
        document.getElementById('message-error').innerText = "Ingrese una contraseña distinta";
        hasErrors = true;
        return
    }

    if (!confirmPassword) {
        document.getElementById('message-error').innerText = 'Debes confirmar la contraseña';
        hasErrors = true;
        return;
    }

    if (password != confirmPassword) {
        document.getElementById('message-error').innerText = 'Las contraseñas con coinciden';
        hasErrors = true;
        return;
    }




    // 4. Si hay errores, cortamos acá. El form no se envía.
    if (hasErrors) {
        return;
    }

    // 5. Si pasamos todas las validaciones, enviamos el formulario al backend 
    form.submit();
});