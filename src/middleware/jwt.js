import { configDotenv } from "dotenv";
import { createToken } from '../helpers/jwt.js';
import jwt from 'jsonwebtoken'
configDotenv();

export function tokenjwt(payload, time){
    return createToken(payload, time)
}

export function desencriptar(req, res, next){
    const key = process.env.KEY;
    const authtoken = req.headers.authorization;
    if( !authtoken ) return res.send('token no proporcionado')
    const token = authtoken.split(' ')[1];
    jwt.verify(token, key, (err, data)=>{
        if(err) return  res.send('token invalido')

        req.user = data
        next()
    })
}