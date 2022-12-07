import mongoose from "mongoose";  // Las dependencias no requieren la extencion .js
import bcrypt from "bcrypt";      // Resulta prolijo importar primero las dependencias y despues lo que se crea
import generarId from "../helpers/generarId.js";
const veterinarioSchema = mongoose.Schema ({    // Schema permite creear el modelo con mongoose, el id lo agrega mongoose
    nombre: {
        type: String,
        required: true,  // Con required se tiene validacion en el servidor
        trim: true   // Se incertan los espacios en blanco que se incerten
    },
    password: {             // Se configura con libreria  
        type: String,
        required: true,     // Cuando se hagan cambios en el modelo se recomienda eliminar la collecion porque se queda almacenado lo registrado
    },
    email: {
        type: String,
        required: true,
        unique: true,      // Un solo email por cuenta
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId(),  
    },
    confirmado: {
        type: Boolean,
        default: false,    // Una vez que el usuario confirma su cuenta cambia a true
    },
});

// Esto hashea el password
veterinarioSchema.pre('save', async function(next) {      // Esto se ejecuta antes de almacenar el registro, sirve para hashear el password, entonces primero lo hashea y despues lo guarda
    if(!this.isModified("password")){       // Esto es para que un password que ya esta hasheado no lo vuelva a hashear
        next();    // Lo que hace next es prevenir que se ejecuta la siguiente linea en caso que se cumpla la condicion 
    }
    
    const salt = await bcrypt.genSalt(10); //Con la dependencia bcrypt se aplica el método genSalt que permite ir en ronda del objeto y buscar el password, bcrypt tiene el método hash.
    this.password = await bcrypt.hash(this.password, salt);  // Basicamente esta linea toma el password y lo hashea utilizando genSatl y hash

});

// Comprueba que el password ingresado coincida con el hasheado

veterinarioSchema.methods.comprobarPassword = async function(    // async bloquea la ejecucion del codigo hasta que se comprueba el password,
    passwordFormulario                                           // con methods se puede registrar funciones que se ejecuten en veterinario.Schema, methods permite declarar la funcion en la misma linea                                                                
    ) {
        return await bcrypt.compare(passwordFormulario, this.password);  // Compare devuelve true o false y compara el password ingresado con el hasheado,       
};                                                                       // la funcion comprobarPassword tiene como parametro el password del formulario,    
                                                                            

// Crea el modelo Veterinario
const Veterinario = mongoose.model("Veterinario", veterinarioSchema); //de esta forma queda REGISTRADO como modelo el modelo creado con Shema
export default Veterinario; 
