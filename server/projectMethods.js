import { Project } from '../imports/api/project.js';


Meteor.methods({
   /** 
      * Método para enviar un mail en formato HTML a un buzón de correo
      * Los parámetros que recibe son: 
      *  - to: El buzón al que se va a enviar el correo
      *  - from: El correo desde el cual se hace el envío
      *  - subject: Asunto del correo
      *  - templateFile : Nombre del archivo HTML que contiene la plantilla de correo, incluir la extensión del archivo
      *  El archivo HTML se encuentra en /private/
      * @author Luis Carlos Jiménez
   */
   sendEmail(to, from, subject, templateFile) {
    
    //Si el método se llama desde los datos de un formulario, validar que sean texto
    //check([to, from, subject, text], [String]);

    // Permitir que otras llamadas a métodos desde el mismo cliente se inicien, sin esperar
    // que se complete el envío del correo
    this.unblock();

    SSR.compileTemplate('htmlEmail', Assets.getText(templateFile));

   var emailData = {
     name: "Luis",
     favoriteRestaurant: "Toks",
     bestFriend: "Tomás",
   };

    Email.send({
     to: to,
     from: from,
     subject: subject,
     html: SSR.render('htmlEmail', emailData),
   });
  },
  /** 
      * Método para actualizar el estatus de enviado a varios colaboradores del proyecto
      * Los parámetros que recibe son: 
      *  - projectID: ID del proyecto 
      *  - collabs: JSon con estructura de colaboradores 
      *  - status: valor que va a tomar el campo invite_sent
      * @author Luis Carlos Jiménez
   */
  updateInvitationStatusForOne(projectID, collabID, status){
   console.log("Llamada a updateInvitationStatusForOne desde el server");
    Project.update(
      {'_id': projectID, 'project_staff._id': collabID}, 
      { 
         "$set": {
            'project_staff.$.invite_sent': true
         }
      });
  },
  /** 
      * Método para actualizar el estatus de enviado a varios colaboradores del proyecto
      * Los parámetros que recibe son: 
      *  - projectID: ID del proyecto 
      *  - collabs: JSon con estructura de colaboradores 
      *  - status: valor que va a tomar el campo invite_sent
      * @author Luis Carlos Jiménez
   */
  updateInvitationStatusForAll(projectID, collabs, status){
    Project.update({"_id": projectID}, {$set: {"project_staff": collabs}});
  }
});