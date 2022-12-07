import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => { // el parametro datos es un objeto (v. el llamado de esta funcion en veterinarioControllers)
        const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,     // Estas son las credenciales de nodemailer
        auth: {                           // Cuando llama a la funcion, se escanea el 
          user: process.env.EMAIL_USER,   // transporter y luego envia el email
          pass: process.env.EMAIL_PASS,   // transporter almacena la instancia de 
        },                                // nodemailer creada
      });
      const {email, nombre, token } = datos;    

      // Enviar el email
      const info = await transporter.sendMail({  // Es esta constante el unico dato que no icorpora es el token
        from: "APV -Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Reestablece tu password",
        text: "Reestablece tu password", 
        html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password.</p>

          <p> Sigue el siguiente enlace para generar tu password:  
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}"> Restablecer password </a> </p>
          <p> Si tu no creaste esta cuenta puedes ignorar este mensaje </p>
        `, 
      }); 
      console.log("Mensaje enviado: %s", info.messageId);

};

 export default emailOlvidePassword 