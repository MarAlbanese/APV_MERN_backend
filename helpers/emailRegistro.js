import nodemailer from "nodemailer";

const emailRegistro = async (datos) => { // el parametro datos es un objeto (v. el llamado de esta funcion en veterinarioControllers)
        const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,     // Estas son las credenciales de nodemailer
        auth: {                           // Cuando llama a la funcion, se escanea el 
          user: process.env.EMAIL_USER,   // transporter y luego envia el email
          pass: process.env.EMAIL_PASS,   // transporter almacena la instancia de 
        },                                // nodemailer creada
      });
      const {email, nombre, token } = datos; // datos es un objeto con tres valores, esos tres valores se 
                                             // se pasan como parametro en la funcion registrar ( v. veterinarioControllers) y son extraidos de la base de datos


      // Enviar el email
      const info = await transporter.sendMail({  // Es esta constante el unico dato que no icorpora es el token
        from: "APV -Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en APC.</p>
          <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
          <a href="${process.env.FRONTEND_URL}/confirmar/${token}"> Comprobar Cuenta </a> </p>
          <p> Si tu no creaste esta cuenta puedes ignorar este mensaje </p>
        `, 
      }); 
      console.log("Mensaje enviado: %s", info.messageId);

      };  

    // Al hacer click en el enlace <a href="${process.env.FRONTEND_URL}/confirmar/${token}"> me  
    // lleva a una pagina que solamente me puede llevar el token que se me asigna (v. App.jsx en ruta 
    // <Route path="confirmar/:id" element = {<ConfirmarCuenta />} />) 
export default emailRegistro 