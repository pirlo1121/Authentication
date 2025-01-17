import { tokenjwt } from "../middleware/jwt.js";
import Users from "../models/users.model.js";
import bcrypt from 'bcrypt';
import { sendVerifyEmail } from "../utils/sendEmail.js";
import { configDotenv } from "dotenv";
import jwt from 'jsonwebtoken';
configDotenv();



export async function register(req, res) {

    try {
        const { name, email, password, password2 } = req.body

        if(!name) return res.send('El nombre es requerido')
        if(!email) return res.send('El correo es requerido')
        if(!password) return res.send('La contraseña es requerida')
        if(!password2) return res.send('La contraseña es requerida')
        if( password !== password2) return res.send(' Las contraseñas no coinciden ')

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // expresiones regulares
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if(!emailRegex.test(email)) return res.send('Email no valido')
        if(!passwordRegex.test(password)) return res.send('Debe contener Mayusculas, minusculas, un numero y un carácter')

        const findUser = await Users.findOne({email});
        if(findUser) return res.send('El correo ya existe')

        const newUser = await Users.create(req.body);
        const token = tokenjwt(newUser)
        await sendVerifyEmail(email, token)

        return res.status(201).send(newUser)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(' error en el servidor ')
    }
    
}

export async function login(req,res){
    try {
        const { email, password } = req.body;
        const findUser = await Users.findOne({email})
        if(!findUser) return res.send(' No existe una cuenta con ese correo ')

        if(!findUser.active) return res.send('Por favor verifica tu cuenta primero')
        const esValida = await bcrypt.compare(password, findUser.password);
        if(!esValida) return res.send('Contraseña incorrecta ')

        const token = tokenjwt({email})
        return res.send(token)
        
    } catch (error) {
        console.log(error)
        return res.send(' error ')
        
    }
}

export async function verifyAccount(req,res) {
    // obtener el token
    const { token } = req.params;
    const key = process.env.KEY;
    if(!token) return res.send(' Token no proporcionado')

  try {
    const decoded = jwt.verify(token, key)
    const id = decoded.payload._id;
    const user = await Users.findById({_id: id})

    if(!user) return res.send('Usuario no encontrado');
    if(user.active) return res.send('la cuenta ya ha sido verificada')
    user.active = true;

    await user.save()
    return res.send('Correo verificado!')
    
  } catch (error) {
    return res.send('error', error)
  }
    
}

export async function updateUser(req,res) {
    const id = req.params.id;
    const data = req.body;

    try {
        const findUer = await Users.findById({_id: id});
        if(!findUer) return res.send(' Usuario no encontrado ');

        const userUpdate = await Users.findByIdAndUpdate(id, data);
        return res.send('usuario actualizado');
        
    } catch (error) {
        console.log(error)
        return res.send('Server error')
        
    }

    
}