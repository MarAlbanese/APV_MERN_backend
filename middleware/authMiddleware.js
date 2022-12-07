import jwt from "jsonwebtoken"; // El paquete de jwt permite crearlo y comprobarlo, en la funcion checkAuth se comprueba.
import Veterinario from "../models/Veterinario.js"; // Importo el modelo porque lo voy a usar para buscar el id del modelo (en const veterinario)

const checkAuth = async (req, res, next) => {    // EL restultado de la ejecucion se ve desde la consola
                                                 // La funcion comprueba que el usuario este autenticado, y en caso de que el usuario este autenticado,
                                                 // lo almacena en la variable req.veterinario                                                  
let token; 

if (req.headers. authorization &&    // En req.headers queda almacenado el jwt generado al momento de 
    req.headers. authorization.startsWith('Bearer') // autenticar el usuario (v. funcion autenticar en VeterinarioController)
// La informacion se extrae .authorization porque req.headers devuelve el token en formato objeto, con el starWith logro comparar el 
// jwt con el valor Bearer. En definitiva el condicional comprueba que el token tenga el bearer -es un filtro mas de seguridad-.  
) {                                                 
    try {  // El try cactch va a tratar de decifrar el token y sino cae en el error
        token = req.headers.authorization.split(" ")[1]; // El codigo lo que hace es separar el bearer de authorization:
                                                         // split separa el codigo de token -el token es el que obtengo cuando autentico usuario-, 
                                                         // al ser un arreglo (bearer + authorization),
                                                         // lo que quiero que imprima es la primera posicion, es decir la authorization,
                                                         // asique en la const token queda almacenado el codigo authorazation sin el bearer.
                                                        
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Se importa jwt para utilizar uno de sus metodos que es verifly, 
        // verifly toma dos parametros, el token que autentica el usuario y la palabra secreta oculta en JWT_SECRET que sirvio para generarlo y 
        // que tambien sirve para verificarlo. Y esa comparacion devolvera el id del usuario (recordar: cuando se genero el jwt, en la funcion autenticar,
        // se agrego el usuario.id, asi se obtiene la informacion del usuario autenticado).
         

        req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); 
        return next()  // La funcion busca que coincida el id (almacenado en decoded) con el id del modelo Veterinario   
        // Se pone decoded.id porque decoded devuelve el id en modelo de objeto (ej.: { id: "123", iat: "233"...-}), por eso para acceder al valor es con el punto (.)      
        // Utilizo req.veterinario -asi lo agrego a express, es decir, en node.js- porque asi crea una sesion con la informacion de veterinario 
        
        // La variable req.veterinario almacena al veterinario autenticado al momento de autenticarse  


    } catch (error) {
        const e = new Error ("Token no valido");
        return res.status(403).json ({ msg: e.message });
        
    }
}
if(!token) { 
    const error = new Error ("Token no valido o inexistente");
    res.status(403).json ({ msg: error.message });
}
    next(); 
}; 

export default checkAuth;

