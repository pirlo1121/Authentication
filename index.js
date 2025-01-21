import express from "express";
import routerProducts from "./src/routes/products.routes.js";
import { conectDB } from "./src/config/DB.js";
import routerUsers from "./src/routes/users.routes.js";

const app = express();
conectDB();


app.use(express.json());
app.use('/api', routerProducts)
app.use('/api', routerUsers)





app.listen(3000, ()=>{
    console.log('serever runing 3000')
})