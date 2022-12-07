import express from "express"; 

const router = express.Router();

import {
        agregarPaciente, 
        obtenerPacientes, 
        obtenerPaciente,  
        actualizarPaciente, 
        eliminarPaciente, 
} from "../controllers/pacienteController.js"; 
import checkAuth from "../middleware/authMiddleware.js"

router
    .route("/")
    .post(checkAuth, agregarPaciente) // Chequea que exista una cuenta y despues envia el post que permite registrar un nuevo paciente
    .get(checkAuth, obtenerPacientes);  // Cuando envia un get trae el paciente asociado con el veterinario autenticado para ver ese paciente

router 
    .route("/:id")
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente) 

export default router;   