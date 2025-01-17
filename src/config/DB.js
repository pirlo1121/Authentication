import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export async function conectDB() {
    const link = process.env.LINKDB;

    try {
        await mongoose.connect(link)
        console.log('conectado a la base de datos')
        
    } catch (error) {
        console.log('no se pudo conectar')
        console.log(error)
        
    }
    
}