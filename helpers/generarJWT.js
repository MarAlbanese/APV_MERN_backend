import jwt from "jsonwebtoken";  // Se importa el paquete jwebtoken

const generarJWT = (id) => {  // Esta funcion genera un jwt, 
                              // Se le pasa como parametro el id de quien se registra para que figure en la base de datos,
                              // se agrega el jwt y process.env es para que pueda el secret key.
        return jwt.sign({ id }, process.env.JWT_SECRET, {    // sing crea un nuevo jwt y se pasa un objeto que se pasa es el que    
        expiresIn: "30d",    // Este es el plazo en que expira el jwt
    });
};

export default generarJWT;  