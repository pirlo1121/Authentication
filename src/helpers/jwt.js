import jwt from  'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

export async function createToken(payload, time) {
    const key = process.env.KEY // secret key
    return jwt.sign({payload}, key, {expiresIn: time})
} 

export function decodeToken(token) {
    try {
        const key = process.env.KEY; 
        const decoded = jwt.verify(token, key);
        return { ok: true, payload: decoded }; 
    } catch (error) {
        console.error('Error al decodificar el token:', error.message);
        return { ok: false, error: error.message }; 
    }
}