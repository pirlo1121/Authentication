import jwt from  'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

export async function createToken(payload, time) {
    const key = process.env.KEY // secret key
    return jwt.sign({payload}, key, {expiresIn: time})
} 
