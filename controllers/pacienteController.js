import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {    // La funcion crean una instancia nueva de Paciente con los datos ingresado en el   
    const paciente = new Paciente (req.body);    // formulario (los cuales se extraen con req.body) y como el modelo paciente tiene 
    paciente.veterinario = req.veterinario._id;  // incorporado todos los datos del veterinario autenticado (v. modelo paciente ultimo objeto) se le puede extraer su id,
                                                 // la forma de extraerlo es con punto guion bajo ("._id") porque ais lo almacena mongodb

    try {
        const pacienteAlmacenado = await paciente.save();
            res.json(pacienteAlmacenado);
        
    } catch (error) {
        console.log(error);
    }

};    

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find() //.find devuelve todos los pacientes con los datos del veterinario usuario autenticado
    .where("veterinario") //.where va a seleccionar la columna de pacientes que se desea filtrar, en este caso veterinario 
    .equals(req.veterinario); // .equals selecciona solamente al veterinario autenticado, el cual esta en la variable req.veterinario -v. authMiddleware-
    
    res.json(pacientes);                 

};

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;   // req.params extrae informacion de la url, en este caso el id del paciente
    const paciente = await Paciente.findById(id); // Busca que coincida el id extraido con el id de alguno de todos los pacientes 
    
    if(!paciente) {
        return res.status(404).json({ msg: "Mensaje no encontrado"}); 
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {  // Esto es: si el veterinario que atiende a ese paciente no es el 
        return res.json({ msg: "Accion no valida" });       // el mismo que el veterinario que es autenticado envia mensaje que "la accion no es valida" 
    }                                                       // Como los id de los veterinarios devuelven un objeto id, con to.String delvuelve en string 
    
    res.json(paciente);
};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;   // req.params extrae informacion de la url, en este caso el id del paciente
    const paciente = await Paciente.findById(id); // Busca que coincida el id extraido con el id de alguno de todos los pacientes 
    
    if(!paciente) {
        return res.status(404).json({ msg: "Mensaje no encontrado"}); 
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {  // Esto es: si el veterinario que atiende a ese paciente no es el 
        return res.json({ msg: "Accion no valida" });       // el mismo que el veterinario que es autenticado envia mensaje que "la accion no es valida" 
    } 
    
    // Actualizar paciente 
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas; 

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error)
    }


};
        



const eliminarPaciente = async (req, res) => {
    const { id } = req.params;   // req.params extrae informacion de la url, en este caso el id del paciente
    const paciente = await Paciente.findById(id); // Busca que coincida el id extraido con el id de alguno de todos los pacientes 
    
    if(!paciente) {
        return res.status(404).json({ msg: "No encontrado"}); 
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {  // Esto es: si el veterinario que atiende a ese paciente no es el 
        return res.json({ msg: "Accion no valida" });       // el mismo que el veterinario que es autenticado envia mensaje que "la accion no es valida" 
    } 
    try {
      await paciente.deleteOne()
        res.json({ msg: "Paciente Eliminado"});  
        
    } catch (error) {
        console.log(error)
    }
};
        


export { 
    agregarPaciente, 
    obtenerPacientes, 
    obtenerPaciente, 
    actualizarPaciente, 
    eliminarPaciente, 
}; 