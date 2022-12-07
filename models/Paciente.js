import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema( {
        nombre: {
            type: String,
            required: true,
        },
        propietario: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        fecha: {
            type: Date,
            required: true,
            default:Date.now(),  
        },
        sintomas: { 
            type: String,
            required: true,
        },
        veterinario: {    // Va a quedar almacenado en el modelo Paciente el id del veterinario que lo registro
            type: mongoose.Schema.Types.ObjectId,
            ref: "Veterinario",   // De ese modo traigo todos los datos del veterinario que lo registro ademas de su id
        },
    },
    {
        timestamps: true,    // Crea las columnas de crado y editado
    }

);
const Paciente = mongoose.model("Paciente", pacientesSchema);  // Con "Paciente" guarda la referencia del modelo y con pacienteSchema la forma de los datos

export default Paciente;