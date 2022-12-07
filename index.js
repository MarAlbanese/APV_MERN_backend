import express from "express"; 
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();
app.use(express.json());  // Esto permite ver los datos ingresados en el postman en la consola

dotenv.config();   
 
conectarDB()

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) { // En la variable origin almacena el dominio que esta realizando la peticion -es decir, localhost 5173, luego se fija si esta registrado en la lista de dominios pemitidos.
        if(dominiosPermitidos.indexOf(origin) !== -1 ){ 
            // El origen el Request esta permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
} 

app.use(cors(corsOptions)); // Se pasa las opciones que cors puede permitir conexion

app.use("/api/veterinarios", veterinarioRoutes); // Quedan registrados las routes
app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('Servidor funcionando en el puerto ${PORT}');

}); 