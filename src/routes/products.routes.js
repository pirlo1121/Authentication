import express from "express";
import { create, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js";
import { desencriptar } from "../middleware/jwt.js";

const router = express.Router()

router.get('/products', desencriptar, getProducts)
router.get('/product/:id', getProductById)
router.post('/createProduct', create)
router.delete('/deleteProduct/:id', deleteProduct)
router.put('/updateProduct/:id', updateProduct)

// CRUD = CREATE, READ, UPDATE, DELETE


export default router