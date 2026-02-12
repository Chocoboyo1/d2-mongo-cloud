const express = require('express');
const connectDB = require('./db');
const Usuario = require('./models/Usuario');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Conectar a MongoDB y luego crear usuario
connectDB().then(() => {
    crearUsuarioInicial();
});

// Función para crear usuario automáticamente
const crearUsuarioInicial = async () => {
    try {
        const existe = await Usuario.findOne({ correo: "profesor@gmail.com" });

        if (!existe) {
            const nuevoUsuario = new Usuario({
                nombre: "Usuario Profesor",
                correo: "profesor@gmail.com"
            });

            await nuevoUsuario.save();
            console.log("Usuario creado automáticamente");
        } else {
            console.log("El usuario ya existe");
        }
    } catch (error) {
        console.log("Error al crear usuario:", error);
    }
};

// Ruta principal
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Ruta para mostrar usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).send("Error al obtener usuarios");
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
