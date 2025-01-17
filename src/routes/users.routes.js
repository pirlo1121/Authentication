import express from "express";
import { login, register, updateUser, verifyAccount } from "../controllers/users.controller.js";


const router = express.Router()

router.post('/userCreate', register);
router.post('/login', login);
router.get('/verify/:token', verifyAccount);
router.put('/updateUser/:id', updateUser)




export default router
