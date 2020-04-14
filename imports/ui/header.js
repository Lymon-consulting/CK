import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
 
import './header.html';
import './projectPage.html';
import '/lib/common.js';

Template.header.rendered = function(){
/*
  FB.getLoginStatus(function(response) {
      statusChangeCallback(response);

      console.log(response);
  });*/
};

Template.header.helpers({
  user(){
      return Meteor.user();
  },
  getProfilePicture() {
    if(Meteor.user().profilePictureID!=null){
      var profile = Media.findOne({'mediaId':Meteor.user().profilePictureID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_50,h_50,c_thumb,f_auto,r_max/" + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().profilePictureID;    
      }

    }
  },
  getInitials(){
    var name = Meteor.user().profile.name;
    var lastname = Meteor.user().profile.lastname;
    var initials = name.charAt(0) + lastname.charAt(0);
    return initials;
  },
  getCrewRoles(){
      var user = Meteor.users.findOne({'_id': Meteor.userId()});
      var result = new Array();
      var strResult = "";
      if(user){
         var crewRoles = user.role;
         
         if(crewRoles){
           for (var i = 0; i < crewRoles.length; i++) {
              result.push(crewRoles[i]);
            }
            for (var i = 0; i < result.length; i++) {
              strResult = strResult + ", " + result[i];
            }
            strResult = strResult.substring(2, strResult.length);
          }
          
        }
      return strResult;
   },
   getCastRoles(){
     var user = Meteor.users.findOne({'_id': Meteor.userId()});
      var result = new Array();
      var strResult = "";
      if(user){
        var castRoles = user.categories;
          if(castRoles){
            for (var i = 0; i < castRoles.length; i++) {
              result.push(castRoles[i]);
            }
            for (var i = 0; i < result.length; i++) {
              strResult = strResult + ", " + result[i];
            }
            strResult = strResult.substring(2, strResult.length);
          }
      }
      return strResult;
   },
   getActiveCrew(){
     var result = "";
     if(Session.get("viewAs")!=null){
       if(Session.get("viewAs")==="crew"){
         result = "active";
       }
     }
     else{
       if(Meteor.user()){
         if(Meteor.user().isCrew!=null && Meteor.user().isCrew){
           result = "active";
         }
       }
     }
     return result;
   },
   getActiveCast(){
     var result = "";
     if(Session.get("viewAs")!=null){
       if(Session.get("viewAs")==="cast"){
         result = "active";
       }
     }
     else{
       if(Meteor.user()){
         //Si tiene crew ya activó el botón de crew, no activar el botón de cast
         if(Meteor.user().isCrew!=null && Meteor.user().isCrew){ 
           result="";
         }
         //Si no tiene crew averiguar si es cast y activar el botón de cast
         else if(Meteor.user().isCast!=null && Meteor.user().isCast){
           result = "active";
         }
       }
     }
     return result;
   }

  

});

Template.profile.helpers({
  getProfilePicture() {
    Meteor.subscribe("allMedia");
    var url;
    if(Meteor.user().profilePictureID!=null){
      var profile = Media.findOne({'mediaId':Meteor.user().profilePictureID});
      if(profile!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_40,h_40,c_thumb,f_auto,r_max/" + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().profilePictureID;    
      }
      
    }
    return url;
    /*
     var url = "";
     if(Meteor.user().profilePictureID!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_40,h_40,c_thumb,f_auto,r_max/" + Meteor.userId() + "/" + Meteor.user().profilePictureID;
     }
     return url;*/
  },
  getInitials(){
    var name = Meteor.user().profile.name;
    var lastname = Meteor.user().profile.lastname;
    var initials = name.charAt(0) + lastname.charAt(0);
    return initials;
  }
});

Template.notifications.helpers({
   getAlerts(){
      var email = "";
      Meteor.subscribe("otherUsers");
      var user = Meteor.users.findOne({"_id" : Meteor.userId()});
      var proyecto = "";
      if(user){
         email = user.emails[0].address;
         userId = user._id;
         var found = Project.find({"$and":[{"project_staff.email": email, "project_staff.confirmed":false}]});

         var alertsFound = new Array();
         if(found){

            found.forEach(function(item){

               var owner = Meteor.users.findOne({_id : item.userId});

               for(var i=0; i<item.project_staff.length; i++){
                  if(item.project_staff[i].email === email && !item.project_staff[i].confirmed){
                     
                     var alert = {
                        "title": item.project_title, 
                        "projectID": item._id,
                        "owner": owner.fullname, 
                        "ownerID": owner._id, 
                        "ownerEmail": owner.emails[0].address,
                        "role": item.project_staff[i].role,
                        "collabID": item.project_staff[i]._id,
                        "collabEmail": item.project_staff[i].email
                     };
                     
                     //console.log(alert);
                     alertsFound.push(alert);
                  }
               }

            });
            //console.log("Tamaño del arreglo: " + alertsFound.length);
         }

      }
      return alertsFound;
   }

});

Template.notifications.events({
   'click .confirmCollaboration' : function(e, template, doc){
       e.preventDefault();

       var id = $(e.target).attr('data-id');
       var proj = $(e.target).attr('data-proj');
       Meteor.call(
         'updateConfirmation',
         proj,
         id,
         true
       );

       Bert.alert({message: 'Has confirmado tu participación en el proyecto', type: 'info'});
   },
   'click .denyColaboration' : function(e, template, doc){
      e.preventDefault();

      if(confirm("Estás a punto de eliminar tu participación en este proyecto, ¿estas seguro?")){
         var proj = $(e.target).attr('data-proj');
         var id = $(e.target).attr('data-id');
         var ownerEmail = $(e.target).attr('data-ownerEmail');
         var collabEmail = $(e.target).attr('data-collabEmail');
         var title = $(e.target).attr('data-title');
         var collabRole = $(e.target).attr('data-collabRole');

         console.log("En el cliente eliminando a: "+ id +", " + collabEmail +", " +  collabRole );

         Meteor.call(
            'deleteCollaboration',
            proj,
            id,
            collabEmail,
            collabRole
         );


         Bert.alert({message: 'Has eliminado tu participación en el proyecto', type: 'info'});

         var emailData = {
           title: title,
           collabEmail: collabEmail,
           collabRole: collabRole
         };

         console.log("Enviando correo a " + ownerEmail);
         
         Meteor.call(
           'sendEmail',
           ownerEmail,
           'Carlos <lcjimenez@gmail.com>',
           'Un colaborador ha rechazado su participación en tu proyecto de Cinekomuna',
           'deny-collaboration-template.html',
           emailData
         );
      }

   }
});

Template.header.events({
    'click .logout': function(event,template){
        event.preventDefault();
        Session.keys = {};
        Meteor.logout();
        FlowRouter.go('/');
    },
    'click #viewAsCrew':function(event,template){
      event.preventDefault();
      Session.set("viewAs","crew");
      $("#viewAsCast").removeClass("active");
      $("#viewAsCrew").addClass("active");
      
      var url = window.location.href;
      //Si está en su perfil de cast o en la edición de perfil de cast y se cambia a crew mandarlo al home
      /*
      if(url.indexOf("/editProfileActor/")>0){
        window.scrollTo(0, 0);
        FlowRouter.go("/editProfile/"+Meteor.userId());
      }
      else if(url.indexOf("/profilePageActor/")>0){
        window.scrollTo(0, 0);
        FlowRouter.go("/profilePage/"+Meteor.userId());
      }*/
      FlowRouter.go("/profilePage/"+Meteor.userId());
    },
    'click #viewAsCast':function(event,template){
      event.preventDefault();
      Session.set("viewAs","cast");
      $("#viewAsCrew").removeClass("active");
      $("#viewAsCast").addClass("active");
      var url = window.location.href;
      //Si está en su perfil de crew o en la edición de perfil de crew y se cambia a cast mandarlo al home
      /*
      if(url.indexOf("/editProfile/")>0){
        window.scrollTo(0, 0);
        FlowRouter.go("/editProfileActor/"+Meteor.userId());
      }
      else if(url.indexOf("/profilePage/")>0){
        window.scrollTo(0, 0);
        FlowRouter.go("/profilePageActor/"+Meteor.userId());
      }*/
      FlowRouter.go("/profilePageActor/"+Meteor.userId());
    }

});