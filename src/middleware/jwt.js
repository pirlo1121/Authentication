import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
configDotenv();

export function tokenjwt(payload){
    const key = process.env.KEY
    return jwt.sign({payload}, key, {expiresIn: '1h'})
}

export function desencriptar(){
    
}