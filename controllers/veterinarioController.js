import Veterinario from "../models/Veterinario.js"; // Se importa modelo porque se va a crear una nueva instancia de Veterinario
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


const registrar = async (req, res) => {

    console.log(req.body);
    const { email, nombre } = req.body 

    // Prevenir usuarios duplicados 
    const existeUsuario = await Veterinario.findOne({ email })
    if(existeUsuario) { 
        const error = new Error ("Usuario ya registrado");
        return res.status(400).json ({ msg: error.message });
    }

    
    try {
        const veterinario = new Veterinario(req.body);   // req.body es de donde vendra la informacion para almacenar el registro del nuevo modelo, la info esta en postman
        const veterinarioGuardado = await veterinario.save();  // se crea una nueva variable para almacenar la informacion en la base de datos con el metodo save()
                                                               // await hara que las siguientes lineas no se ejecuten hasta que no se cumple
       
        // Enviar el email
        emailRegistro({  // La funcion tiene como parametro un objeto con tres elementos:
            email,    // email y nombre los extrae del veterinario usuario que  
            nombre,   // completa el formulario al momento de utenticarse, pero la informacion en si misma la extrae de la base de datos
            token: veterinarioGuardado.token,  // el token lo extrae del veterinario autenticado y tambien se extrae la informacion de la base de datos
        });

        res.json(veterinarioGuardado); // La informacion de esa variable se vera en la bd y en postman, incluso el password por eso se debe hashear
    } catch (error) {
        console.log(error);
    }

    
};


const perfil = (req, res) => {
    const { veterinario } = req; // Extraigo los datos de veterinario almacenados en node.js (recordar: veterinario se crea en la funcion checkAuth y 
                                 // almacena todos los datos de un modelo Veterinario existente, asi se comprueba que existe el perfil del usuario
    res.json({ perfil: veterinario }); // Aca retorno a postman la informacion almacenada en node.js de veterinario que extraje arriba 
};

const confirmar = async (req, res) => {
    const { token } = req.params    // req.params extrae la informacion del router dinamico (el valor va despues de los /:)

    const usuarioConfirmar = await Veterinario.findOne({ token }) // Busca el token que ingresa el usuario

    if (!usuarioConfirmar) {
        const error = new Error ("Token no valido");
        return res.status(404).json({ msg: error.message });
    }

    try {      

        usuarioConfirmar.token = null;    // Aca se modifican los datos una vez que se ingresa el token
        usuarioConfirmar.confirmado = true;  // Con try si hay un error en las lineas se pasa directamente al catch salteando el mesaje json
        await usuarioConfirmar.save();        
        
        res.json({ msg: "Usuario confirmado corectamente" });

        } catch (error) {
            console.log(error);  
        }
    };
   
    const autenticar = async (req, res) => {
        const { email, password } = req.body // Con re.body (metodo para postman) accedo a los datos ingresados en formulario   
                                             // Los datos ingresados en formulario seran constatados con la informacion de la bd 
        
        // Comprobar si el usuario existe  
        const usuario = await Veterinario.findOne({email}) // usuario almacena un email que ya existe en el modelo
        if (!usuario) {
            const error = new Error ("El usuario no existe");
            return res.status(404).json({ msg: error.message });
        }
    
        // Comprobar si el usuario esta confirmado
        if (!usuario.confirmado){    // Esta negacion es si el usuario no esta confirmado (confirmado en el modelo tiene true)
            const error = new Error ("Tu cuenta no ha sido confirmada");
            return res.status(403).json({ msg: error.message });

        }

        //Revisar el password
        if( await usuario.comprobarPassword(password)){    
                                                        // Si se cumple la condicion que el usuario al momento de autenticarse ingresa el mismo password que cuando se registro, se genera un token.    
                                                        // Esa funcion la puedo usuar porque en Veterinaio.js al declararla aplique methods
                                                        // Esa funcion se declaro en en Veterinario.js 
        // Autenticar 
        res.json({
        _id: usuario._id,    
        nombre: usuario.nombre,
        email: usuario.email,                           // Cumplido el if, se devuelve en json todos los datos del usuario autenticado  
        token: generarJWT(usuario.id),                  // entonces al colocar el jwt me imprime el id del usuario, sirve para registro interno
        });                                               
                                                          

        } else {
            const error = new Error ("El password es incorrecto");
            return res.status(403).json({ msg: error.message });
        }
    };

const olvidePassword = async (req, res) => {
    const { email } = req.body   // req.body accedo a la informacion de un formulario
    
    const existeVeterinario = await Veterinario.findOne({ email });  // En const existeVeterinario almaceno el modelo del veterinario que coincide con el email
    if(!existeVeterinario){
        const error = new Error("El Ususuario no existe");
        return res.status(400).json({ msg: error.message }); 
    }

    try {
        existeVeterinario.token = generarId();  // Al modelo Veterinario le genero un id unico con la funcion generarID y se lo agrego al token 
        await existeVeterinario.save();

        // Envia email con instruciones
        emailOlvidePassword({  // esta funcion del helpers
            email,
            nombre: existeVeterinario.nombre, // el nombre lo extrae de la instancia de veterinario creada al momento de registrarse 
            token: existeVeterinario.token, 

        });

        res.json({ msg: "Hemos enviado un email con las instrucciones" });
        
    } catch (error) {
        console.log (error)
    }

};

const comprobarToken = async (req, res) => {     // Recordar que estas funciones sirven para comprobar en el servidor los datos que se ingresan por formulario
    const { token } = req.params  // req.params es informacion de la url
    const tokenValido = await Veterinario.findOne ({ token });

    if(tokenValido){
        // El Token es valido el usuario existe
        res.json({ msg: "Token valido y el usuario existe" });
    } else {
        const error = new Error('Token no valido')
        return res.status(400).json({ msg: error.message });   
    }
};

 
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario =  await Veterinario.findOne({ token }); // Se pone const veterinario porque se va a modificar el objeto, esta
                                                              // primera linea busca el token en el modelo y lo valida
    if(!veterinario){
        const error = new Error('hubo un error')
        return res.status(400).json({ msg: error.message });    
    }

    try {   
        veterinario.token = null;  // reescribe la propiedad que se va a modificar
        veterinario.password = password;  // reescribe la propiedad que se va a modificar
        await veterinario.save();
        res.json({ msg: "Password modificado correctamente" });
        
        } catch (error) {
        console.log(error);
        }
    };

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    const { email } = req.body 
    if( veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email })
        if(existeEmail) {
            const error = new Error ("Ese email ya esta en uso");
            return res.status(400).json({ msg: error.message});
        }
    }

    
    try {
        veterinario.nombre  = req.body.nombre; 
        veterinario.email  = req.body.email; 
        veterinario.web  = req.body.web; 
        veterinario.telefono  = req.body.telefono; 

        const veterinarioActualizado = await veterinario.save();
        res.json (veterinarioActualizado);


    } catch (error) {
        console.log(error)
        
    }

};

const actualizarPassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo  } = req.body;  

    // Comprobar que el veterinario exista 

    const veterinario = await Veterinario.findById(id);
    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }
    // Comprobar su password 
    if (await veterinario.comprobarPassword(pwd_actual)) {
        //Almacenar nuevo password
        veterinario.password = pwd_nuevo; 
        await veterinario.save();
        res.json ({msg: "Password Almacenado Correctamente" });
    } else {
        const error = new Error ("El Password Actual es Incorrecto");
        return res.status(400).json({ msg: error.message});
    }

    // Almacenar su nuevo password 

};

export { 
    registrar, 
    perfil, 
    confirmar, 
    autenticar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
}; 
