import { Project } from '../imports/api/project.js';
import { Portlet } from '../imports/api/portlet.js';


Meteor.methods({
   /** 
      * Método para enviar un mail en formato HTML a un buzón de correo
      * Los parámetros que recibe son: 
      *  - to: El buzón al que se va a enviar el correo
      *  - from: El correo desde el cual se hace el envío
      *  - subject: Asunto del correo
      *  - templateFile : Nombre del archivo HTML que contiene la plantilla de correo, incluir la extensión del archivo
      *  - emailData: Objeto JSON con las variables que se renderizarán en la plantilla html correspondiente
      *  El archivo HTML se encuentra en /private/
      * @author Luis Carlos Jiménez
   */
   sendEmail(to, from, subject, templateFile, emailData) {
    
    //Si el método se llama desde los datos de un formulario, validar que sean texto
    //check([to, from, subject, text], [String]);

    // Permitir que otras llamadas a métodos desde el mismo cliente se inicien, sin esperar
    // que se complete el envío del correo
    this.unblock();

    SSR.compileTemplate('htmlEmail', Assets.getText(templateFile));

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
  },
  /** 
      * Método para actualizar el estatus de una colaboración del proyecto
      * Los parámetros que recibe son: 
      *  - projectID: ID del proyecto 
      *  - collabID: ID del colaborador 
      *  - status: valor que va a tomar el campo confirmed
      * @author Luis Carlos Jiménez
   */
  updateConfirmation(projectID, collabID, status){
   //console.log("Llamada a updateInvitationStatusForOne desde el server");
    Project.update(
      {'_id': projectID, 'project_staff._id': collabID}, 
      { 
         "$set": {
            'project_staff.$.confirmed': true
         }
      });
  },
  /** 
      * Método para eliminar a un colaborador de un proyecto
      * Los parámetros que recibe son: 
      *  - projectID: ID del proyecto 
      *  - collaborator: Objeto JSON con los datos del colaborador
      * @author Luis Carlos Jiménez
   */
  deleteCollaboration(projectID, collabID, collabEmail, collabRole){

   var collaborator = {
      "_id": collabID,
      "email": collabEmail,
      "role": collabRole
   };

   console.log("En el server eliminando a: " + collabID + ", " + collabEmail + ", " +  collabRole);

   Project.upsert(
      {'_id': projectID},
      { $pull: { project_staff: collaborator }
   });
  },
  insertPortlet(projectID, portletTitle, portletContent){
    /*
   var date = new Date()
   var newID = moment(date).format("x"); 

   var portlet = {
      "_id": newID,
      "title": portletTitle,
      "content": portletContent,
      "order": "100"
   };
   
   Project.upsert(
      {'_id': projectID},
      { $push: { project_portlets: portlet }
   });*/
   Portlet.insert({
            "projectID": projectID,
            "title": portletTitle,
            "content": portletContent,
            "order": "100" 
         });
  },
  updatePortlet(portletID, portletTitle, portletContent){
     Portlet.update({"_id": portletID},
        {$set:{
          "title": portletTitle,
          "content": portletContent
        }
      });
   /*
   Project.update(
      {'_id': projectID, 'project_portlets._id': portletID},
        { $set: { 
          'project_portlets.$.content': portletContent, 
          'project_portlets.$.title':portletTitle 
        } 
      }
   );*/
   
  },
  insertProject(userId, proj_name, proj_type, proj_genre, proj_desc, proj_year, proj_role, proj_main, proj_web_page, proj_facebook_page, proj_twitter_page, proj_vimeo_page, proj_youtube_page, proj_instagram_page){
    Project.insert({
      "project_title": proj_name,
      "project_type": proj_type,
      "project_genre": proj_genre,
      "project_desc": proj_desc, 
      "project_year": proj_year,
      "project_role": proj_role,
      "project_is_main": proj_main,
      "project_web_page": proj_web_page,
      "project_facebook_page": proj_facebook_page,
      "project_twitter_page": proj_twitter_page,
      "proj_vimeo_page": proj_vimeo_page,
      "proj_youtube_page": proj_youtube_page,
      "proj_instagram_page": proj_instagram_page,
      "userId": Meteor.userId()
     });
  },
  updateProject(projectId, proj_name, proj_type, proj_genre, proj_desc, proj_year, proj_main, proj_web_page, proj_facebook_page, proj_twitter_page, proj_vimeo_page, proj_youtube_page, proj_instagram_page){
    Project.update({_id: projectId},{
      $set:{
        "project_title": proj_name,
        "project_type": proj_type,
        "project_genre": proj_genre,
        "project_desc": proj_desc, 
        "project_year": proj_year,
        "project_is_main": proj_main,
        "project_web_page": proj_web_page,
        "project_facebook_page": proj_facebook_page,
        "project_twitter_page": proj_twitter_page,
        "proj_vimeo_page": proj_vimeo_page,
        "proj_youtube_page": proj_youtube_page,
        "proj_instagram_page": proj_instagram_page
     }});
  },
  updateMain(current){
    Project.update({'_id': current},{
      $set:{
        "project_is_main": "" 
      }
    });  
  },
  addRoleToProject(projectId, role){
    console.log("Llamada a addRoleToProject con "+ projectId + " y " + role);
    Project.update({'_id': projectId},
      {
        $addToSet: {
                "project_role": role
              }
         });
  },
  removeRoleFromProject(projectId, role){
    Project.update({'_id': projectId}, 
      {
        $pull: {
                "project_role": role
              }
         });
  }


});