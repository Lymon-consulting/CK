import { Project } from '../imports/api/project.js';
import { Portlet } from '../imports/api/portlet.js';
import { Media } from '../imports/api/media.js';


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
      {'_id': projectID, 'project_staff.id': collabID}, 
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
      {'_id': projectID, 'project_staff.id': collabID}, 
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
  deleteCollaboration(projectID, collabID){

   var collaborator = {
      "id": collabID
   };

   /*
   ,
      "email": collabEmail,
      "role": collabRole
   */

   console.log("En el server eliminando a: " + collabID);

   Project.update(
      {'_id': projectID},
      { $pull: { project_staff: collaborator }
   });
  },
  insertPortlet(projectID, portletType, portletTitle, portletContent, portletAuthor, portletUrl, portletOrder){
    //console.log("En el server el tipo de portlet es "+portletType);

   return Portlet.insert({
            "projectID": projectID,
            "type" : portletType, //text, image, video, quote, link
            "title": portletTitle,
            "content": portletContent,
            "author": portletAuthor,//only used for quote type
            "url": portletUrl,//only used for link type
            "order": portletOrder
         }, function(error,result){
            //console.log("desde el server el id es "+result);
            return result;
         });
   //return newPortlet;
  },
  updatePortlet(portletID, portletTitle, portletContent, portletAuthor, portletUrl){
     Portlet.update({"_id": portletID},
        {$set:{
          "title": portletTitle,
          "content": portletContent,
          "author": portletAuthor,
          "url": portletUrl
        }
      });
  },
  deletePortlet(portletID){
     Portlet.remove({"_id": portletID});
  },
  updatePortletOrder(portlet){
     Portlet.update({"_id": portlet._id},
        {$set:{
          "order": portlet.order,
        }
      });
  },
  insertProject(userId, proj_name, proj_type, proj_genre, proj_desc, proj_year, proj_role, proj_main, proj_web_page, proj_facebook_page, proj_twitter_page, proj_vimeo_page, proj_youtube_page, proj_instagram_page){
    return Project.insert({
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
     },function(error,result){
        return result;
     });
  },
  updateProjectSample(projectId, proj_name, proj_year, status){
    Project.update({_id: projectId},{
      $set:{
        "project_title": proj_name,
        "project_year": proj_year,
        "status": status
     }});
  },
  updateProjectProduction(projectId, proj_name, proj_year, proj_genre, proj_status, proj_type, proj_desc, proj_web_page, proj_facebook_page, proj_twitter_page, proj_instagram_page, proj_vimeo_page, proj_youtube_page, proj_imdb_page, proj_external_view, status){
    Project.update({_id: projectId},{ 
      $set:{
        "project_title": proj_name,
        "project_year": proj_year,
        "project_genre": proj_genre,
        "project_status": proj_status,
        "project_type": proj_type,
        "project_desc": proj_desc, 
        "project_web_page": proj_web_page,
        "project_facebook_page": proj_facebook_page,
        "project_twitter_page": proj_twitter_page,
        "proj_instagram_page": proj_instagram_page,
        "proj_vimeo_page": proj_vimeo_page,
        "proj_youtube_page": proj_youtube_page,
        "proj_imdb_page": proj_imdb_page,
        "proj_external_view": proj_external_view,
        "status":status
     }});
  },
  updateMain(projectID, status){
    Project.update({'_id': projectID},{
      $set:{
        "project_is_main": status
      }
    });  
  },
  setOficial(projectId, isOficial){
    Project.update({'_id': projectId},{
      $set:{
        "oficial": isOficial 
      }
    });  
  },
  addRoleToProject(projectId, role){
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
  },
  removeAllRolesFromProject(projectId){
    Project.update({'_id': projectId}, 
      {
        $set: {
                "project_role": []
              }
         });
  },
  saveProjectPictureID(projectId, projectPictureID){
    //console.log("Guardando "+ projectPictureID + " en proyecto "+projectId);
    Project.update({'_id': projectId}, {
      $set:
        {
          "projectPictureID": projectPictureID
        }
    });
  },
  saveProjectPosterID(projectId, projectPosterID){
    //console.log("Guardando "+ projectPictureID + " en proyecto "+projectId);
    Project.update({'_id': projectId}, {
      $set:
        {
          "projectPosterID": projectPosterID
        }
    });
  },
  savePortletPictureID(portletId, portletPictureID, version){
    //console.log("Guardando "+ projectPictureID + " en proyecto "+projectId);
    Portlet.update({'_id': portletId}, {
      $set:
        {
          "url": portletPictureID,
          "version": version
        }
    });
  },
  saveVersion(portletId, version){
    //console.log("Guardando "+ projectPictureID + " en proyecto "+projectId);
    Portlet.update({'_id': portletId}, {
      $set:
        {
          "version": version
        }
    });
  },
  deleteProjectPicture(projectId, projectPictureID){
    Project.update({'_id': projectId}, {
      $set:
        {
          "projectPictureID": null
        }
    }); 
  },
  updateBookOrder( books ) {
    check( books, [{
      _id: String,
      order: Number
    }]);

    for ( let book of books ) {
      Potlet.update( { _id: book._id }, { $set: { order: book.order } } );
    }
  },
  addProjectName(project_title, userId, family){
    return Project.insert({
      "project_title": project_title,
      "userId": userId,
      "project_family": family,
      "project_is_main": false
    });
  },
  'updateProjectTitle'(projectId, project_title){
    Project.update({'_id':projectId},{
      $set:
      {
        "project_title":project_title
      }
    });
  },
  'updateProjectType'(projectId, project_type){
    Project.update({'_id':projectId},{
      $set:
      {
        "project_type":project_type
      }
    });
  },
  'updateProjectGenre'(projectId, project_genre){
    Project.update({'_id':projectId},{
      $set:
      {
        "project_genre":project_genre
      }
    });
  },
  'updateProjectStatus'(projectId, project_status){
    Project.update({'_id':projectId},{
      $set:
      {
        "project_status":project_status
      }
    });
  },
  'updateProjectDescription'(projectId, project_desc){
    Project.update({'_id':projectId},{
      $set:
      {
        "project_desc":project_desc
      }
    });
  },
  'updateProjectYear'(projectId, project_year){
    Project.update({'_id':projectId},{
      $set:
      {
        "project_year":project_year
      }
    });
  },
  'updateProjectWeb'(projectId, project_web_page){
    Project.update({'_id':projectId},{
      $set:
      {
        "project_web_page":project_web_page
      }
    });
  },
  'updateProjectFacebook'(projectId, project_facebook_page){
    Project.update({'_id':projectId},{
      $set:
      {
        "project_facebook_page":project_facebook_page
      }
    });
  },
  'updateProjectTwitter'(projectId, project_twitter_page){
    Project.update({'_id':projectId},{
      $set:
      {
        "project_twitter_page":project_twitter_page
      }
    });
  },
  'updateProjectVimeo'(projectId, proj_vimeo_page){
    Project.update({'_id':projectId},{
      $set:
      {
        "proj_vimeo_page":proj_vimeo_page
      }
    });
  },
  'updateProjectYoutube'(projectId, proj_youtube_page){
    Project.update({'_id':projectId},{
      $set:
      {
        "proj_youtube_page":proj_youtube_page
      }
    });
  },
  'updateProjectInstagram'(projectId, proj_instagram_page){
    Project.update({'_id':projectId},{
      $set:
      {
        "proj_instagram_page":proj_instagram_page
      }
    });
  },
  'updateProjectExternalView'(projectId, proj_external_view){
    Project.update({'_id':projectId},{
      $set:
      {
        "proj_external_view":proj_external_view
      }
    });
  },
  addOneView(projectId){
    Project.update(
         {'_id': projectId},
         { $inc:{ 'views': 1}
      });
  },
  addGalleryProject(projectId,mediaId){
    Project.update({'_id': projectId}, 
      {
        $addToSet: {
          "gallery": mediaId
        }
      });
  },
  removeGalleryProject(projectId,mediaId){
    Project.update({'_id': projectId}, 
      {
        $pull: {
          "gallery": mediaId
        }
      });
  },
  deleteProject(projectID){
    console.log("Eliminando porlets con projectID="+projectID);
    Portlet.remove({"projectID": projectID});

    console.log("Eliminando media con projectID="+projectID);
    Media.remove({"projectId": projectID});

    console.log("Eliminando likes de los usuarios con projectID="+projectID);
    Meteor.users.update({'likesProject': projectID}, {
        $pull: {
          "likesProject": projectID
        }
      });

    console.log("Eliminando el proyecto="+projectID);
    Project.remove({"_id": projectID});
  },
});