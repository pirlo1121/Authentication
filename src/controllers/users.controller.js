import { tokenjwt } from "../middleware/jwt.js";
import Users from "../models/users.model.js";
import bcrypt from 'bcrypt';
import { sendVerifyEmail } from "../utils/sendEmail.js";
import { configDotenv } from "dotenv";
import jwt from 'jsonwebtoken';
configDotenv();

// Registro de usuario
export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name) return res.status(400).send('El nombre es requerido');
        if (!email) return res.status(400).send('El correo es requerido');
        if (!password) return res.status(400).send('La contraseña es requerida');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!emailRegex.test(email)) return res.status(400).send('Email no válido');
        if (!passwordRegex.test(password)) return res.status(400).send('Debe contener mayúsculas, minúsculas, un número y un carácter especial');

        const findUser = await Users.findOne({ email });
        if (findUser) return res.status(409).send('El correo ya existe');

        const newUser = await Users.create(req.body);
        const token = tokenjwt(newUser, '3600s');
        await sendVerifyEmail(email, token);

        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error en el servidor');
    }
}

// Inicio de sesión
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const findUser = await Users.findOne({ email });
        if (!findUser) return res.status(404).send('No existe una cuenta con ese correo');

        // if (!findUser.active) return res.status(403).send('Por favor verifica tu cuenta primero');
        const esValida = await bcrypt.compare(password, findUser.password);
        if (!esValida) return res.status(401).send('Contraseña incorrecta');

        const token = tokenjwt({ email }, '1h');
        console.log(token);
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error en el servidor');
    }
}

// Verificación de cuenta
export async function verifyAccount(req, res) {
    const { token } = req.params;
    const key = process.env.KEY;

    if (!token) return res.status(400).send('Token no proporcionado');

    try {
        const decoded = jwt.verify(token, key);
        const id = decoded.payload._id;

        const user = await Users.findById({ _id: id });
        if (!user) return res.status(404).send('Usuario no encontrado');
        if (user.active) return res.status(400).send('La cuenta ya ha sido verificada');

        user.active = true;
        await user.save();

        return res.status(200).send('Correo verificado');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error en el servidor');
    }
}

// Actualización de usuario
export async function updateUser(req, res) {
    const id = req.params.id;
    const data = req.body;

    try {
        const findUser = await Users.findById({ _id: id });
        if (!findUser) return res.status(404).send('Usuario no encontrado');

        await Users.findByIdAndUpdate(id, data);
        return res.status(200).send('Usuario actualizado');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error en el servidor');
    }
}
