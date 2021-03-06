import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { getRoleById } from '/lib/globals.js';
 
import './header.html';
import './notifications.html'; 
import './messageIcon.html'; 
import '/lib/common.js';

Template.header.helpers({
  user(){
      return Meteor.user();
  },
  getProfilePicture() {
    var profile;
    if(Meteor.user()!=null){
      if(Meteor.user().profilePictureID!=null){
        profile = Media.findOne({'mediaId':Meteor.user().profilePictureID});
        if(profile!=null){
          return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_40,h_40,c_thumb,f_auto,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + Meteor.user().profilePictureID;
        }
      }
    }
  },
  getFirstRoles(){
    var result = new Array();
    var strResult = "";
     
      var userRoles = Meteor.user().role;
      if(userRoles!=null){
        for (var i = 0; i < userRoles.length && i<Meteor.settings.public.MAX_ROLES_DISPLAY; i++) {
          result.push(getRoleById(userRoles[i]));
        }
      }

      for (var i = 0; i < result.length; i++) {
        strResult = strResult + ", " + result[i].roleName;
      }
      strResult = strResult.substring(2, strResult.length);
      if(userRoles!=null && userRoles.length>Meteor.settings.public.MAX_ROLES_DISPLAY){
        strResult = strResult + "..." ;
      }

    return strResult;
   },
  getInitials(){
    var name = Meteor.user().profile.name;
    var lastname = Meteor.user().profile.lastname;
    var initials = name.charAt(0) + lastname.charAt(0);
    return initials;
  },
  getName(){
      var name = "";
      var user = Meteor.user();
      if(user!=null){

          if(user.viewAs===2 && user.cast!=null && user.cast.showArtisticName){
            name = user.cast.artistic;
          }
          else{
            if(user.profile.name!=null && user.profile.name!=""){
              name = user.profile.name;  
            }
            if(user.profile.lastname!=null && user.profile.lastname!=""){
              name = name + " " + user.profile.lastname;
            }
            if(user.profile.lastname2!=null && user.profile.lastname2!=""){
              name = name + " " + user.profile.lastname2;
            }
          }
      }
      return name;
    },
isCastChecked(){
  var result = false;
  if(Meteor.user()){
    if(Meteor.user().isCast!=null && Meteor.user().isCast){
      result=true;
    }
  }
  return result;
},
isCrewChecked(){
  var result = false;
  if(Meteor.user()){
    if(Meteor.user().isCrew!=null && Meteor.user().isCrew){
      result=true;
    }
  }
  return result;
},
  getCrewRoles(){
      var user = Meteor.users.findOne({'_id': Meteor.userId()});
      var result = new Array();
      var strResult = "";
      if(user){
         /*
         var topRole = user.topRole;
         if(topRole){
           for (var i = 0; i < topRole.length; i++) {
             if(topRole[i]==="1"){
               result.push("Producción");
             }
             else if(topRole[i]==="2"){
               result.push("Dirección");
             }
           }
         }*/

         var crewRoles = user.role;
         if(crewRoles){
           for (var i = 0; i < crewRoles.length; i++) {
            console.log(crewRoles[i]);
              if(crewRoles[i] != parseInt(Meteor.settings.public.BUSINESS_ID) && crewRoles[i] != parseInt(Meteor.settings.public.REPRESENTATIVE_ID)){
                result.push(getRoleById(crewRoles[i]).roleName);
              }
            }
            
          }

          for (var i = 0; i < result.length; i++) {
            strResult = strResult + ", " + result[i];
          }
          strResult = strResult.substring(2, strResult.length);
          
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
     if(Meteor.user().viewAs){
       if(Meteor.user().viewAs===1){//1=crew
         result = "active";
       }
     }
     /*
     else{
       if(Meteor.user()){
         if(Meteor.user().isCrew!=null && Meteor.user().isCrew){
           result = "active";
         }
       }
     }*/
     return result;
   },
   getActiveCast(){
     var result = "";
     if(Meteor.user().viewAs){
       if(Meteor.user().viewAs===2){//2=cast
         result = "active";
       }
     }/*
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
     }*/
     return result;
   }

  

});

Template.profile.helpers({
  getProfilePicture() {
    Meteor.subscribe("allMedia");
    var url;
    var profile;
    if(Meteor.user()){
        profile = Media.findOne({'mediaId':Meteor.user().profilePictureID});
        if(profile!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_40,h_40,c_thumb,f_auto,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
//                Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
        }
      
    }
    
    return url;
  },
  getInitials(){
    var name = Meteor.user().profile.name;
    var lastname = Meteor.user().profile.lastname;
    var initials = name.charAt(0) + lastname.charAt(0);
    return initials;
  }
});



Template.header.events({
    'click .logout': function(event,template){
        event.preventDefault();
        Session.keys = {};
        Meteor.logout();
        //FlowRouter.go('/home');
        FlowRouter.go('/');
        //document.location.reload(true);
    },
    'click #viewAsCrew':function(event,template){
      event.preventDefault();
      
      Meteor.call('setViewAs', Meteor.userId(),1); //1=Crew

      //Session.set("viewAs","crew");
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
      window.scrollTo(0, 0);
      FlowRouter.go("/profilePage/"+Meteor.userId());
    },
    'click #viewAsCast':function(event,template){
      event.preventDefault();
      //Session.set("viewAs","cast");
      Meteor.call('setViewAs', Meteor.userId(),2); //2=Cast
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
      window.scrollTo(0, 0);
      FlowRouter.go("/profilePageActor/"+Meteor.userId());
    }

});