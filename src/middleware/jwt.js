import { configDotenv } from "dotenv";
import { createToken, decodeToken } from '../helpers/jwt.js';

configDotenv();

export function tokenjwt(payload, time){
    return createToken(payload, time)
}

export function desencriptar(req, res, next){
    
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ 
            ok: false, 
            message: 'Token no proporcionado' 
        });
    }

    const result = decodeToken(token);

    if (!result.ok) {
        return res.status(403).json({ 
            ok: false, 
            message: 'Token inválido o expirado', 
            error: result.error 
        });
    }

    req.user = result.payload;
    next(); 

}
