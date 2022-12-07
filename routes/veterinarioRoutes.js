import express from "express";
const router = express.Router();
import { registrar, 
        perfil, 
        confirmar, 
        autenticar, 
        olvidePassword, 
        comprobarToken, 
        nuevoPassword, 
        actualizarPerfil,
        actualizarPassword, 
    } from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";


// Area Publica
router.post('/', registrar); 

router.get("/confirmar/:token", confirmar);

router.post('/login', autenticar); 

router.post("/olvide-password", olvidePassword); // valida email del usuario

router.route ("/olvide-password/:token").get(comprobarToken).post(nuevoPassword); // lee el token y almacena el nuevo password

// Area Privada 
router.get("/perfil", checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);

export default router;      