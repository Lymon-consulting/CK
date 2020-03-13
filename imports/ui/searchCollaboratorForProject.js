import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Project } from '../api/project.js';
import { UsersIndex } from '/lib/common.js';

import './searchCollaboratorForProject.html';
import '/lib/common.js';


Meteor.subscribe("otherUsers");
Template.searchCollaboratorForProject.helpers({
   usersIndex: () => UsersIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
       placeholder: 'Buscar', 
       id: 'searchBox'
     }; 
   },
   getAllOcupations(){
    return Ocupation.find({},{sort:{"secondary":1}}).fetch();
  },
  getAvailableYears(){
   var years = new Array();

   for(i=2018; i>1970; i--){
     years.push(i);
   }
   return years;
 },
 getCitiesFromCountries(){
  return City.find({'country': 'México'},{sort:{'city':1}}).fetch(); 
},
profilePicture(userId){
  return Images.find({'owner': userId});
},
notSameUser(userId){
  val = true;
  if(userId=== Meteor.userId()){
   val = false;
 }
 return val;
},
getProjectName(){
  var project = Project.findOne({'_id': FlowRouter.getParam('id')});
  var name = "";
  if(project!=null){
    name = project.project_title;
  }
  return name;
},
getProjectID(){
  return FlowRouter.getParam('id');
},
checkParticipation(userId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': FlowRouter.getParam('id')});
    var result="";
    if(project){
      var staff = project.project_staff;
      if(staff!=null && staff!=""){
        for (var i = staff.length - 1; i >= 0; i--) {
          if(staff[i]._id === userId){
            result="checked";
            break;
          }
        }
      }

      if(userId === project.userId){
        result="checked";
      }
    }
    return result;
  },
  getRole(userId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': FlowRouter.getParam('id')});
    var result="";
    if(project){
      var staff = project.project_staff;
      if(staff!=null && staff!=""){
        for (var i = staff.length - 1; i >= 0; i--) {
          if(staff[i]._id === userId){
            result=staff[i].role;
            break;
          }
        }
      }
      if(userId === project.userId){
        result="Dueño del proyecto";
      }
    }
    return result;
  },
/*   personalCover(userId){
      Meteor.subscribe("personalcover");
      return PersonalCover.find({'owner': userId});
    },*/
    showButtonFollow(follow){
      var following = Meteor.users.find({$and : [ {'_id' : Meteor.userId()} , {"follows": follow }]});

      var found = true;
      if(following.count() > 0){
       found = false;
     }
     return found;
   },
   getRoleSelected: function(value){
    var prole = "";
    if(Session.get("role_selected")!=null){
      prole = Session.get("role_selected");
    }
    else{
      prole = "cualquier";
    }
    return (prole === value) ? 'selected' : '' ;
  },
  getLocationSelected: function(value){
    var plocation = "";
    if(Session.get("location_selected")!=null){
      plocation = Session.get("location_selected");
    }
    else{
      plocation = "cualquier";
    }
    return (plocation === value) ? 'selected' : '' ;
  },
  getProfilePicture(userId, size) {
   var url = "";
   var user = Meteor.users.findOne({'_id':userId});
   if(user.profilePictureID!=null && user.profilePictureID!=""){
    url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",h_"+size+",c_thumb,r_max/" + user.profilePictureID;
  }
  return url;
},
getInitials(userId){
  var name = "";
  var lastname = "";
  var initials = "";      
  var user = Meteor.users.findOne({'_id':userId});
  if(user){
    name = user.profile.name;
    lastname = user.profile.lastname;
    initials = name.charAt(0) + lastname.charAt(0);  
  }
  return initials;
},
getCoverPicture(userId, size) {
 Meteor.subscribe("otherUsers");
 var url = "";
 var user = Meteor.users.findOne({'_id':userId});
 if(user.profileCoverID!=null && user.profileCoverID!="undefined"){
  url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_scale/" + user.profileCoverID;
}
return url;
}


});

Template.searchCollaboratorForProject.events({
 'click input': function(event) {
    if(event.target.checked){
      $("#sel_"+event.target.value).removeAttr('disabled');
      $("#but_"+event.target.value).removeAttr('disabled');
      $("#but_"+event.target.value).css('background','#ED1567');
    }
    else{
     //console.log("false");
     $("#sel_"+event.target.value).attr('disabled', 'disabled');
     $("#but_"+event.target.value).attr('disabled', 'disabled');
     $("#but_"+event.target.value).css('background','#666');
   }
 },
 'click #pushFollow': function(event, template) {
  event.preventDefault();


      //console.log("Intentando seguir a "+ Session.get('userID'));
      var user = $("#thisUser").val();
      Meteor.users.update(
       {'_id': Meteor.userId()},
       { $push: { 'follows': user } }
       );

      $("#pushFollow").attr("disabled", true);
    },
    'click .pushCollaborator': function(event, template) {
      event.preventDefault();
      var user = event.target.id;
      Session.set("collaborator",user);
      FlowRouter.go('/addCollaborator');
    },
    'click #buscarBtn': function(event, template) {
      //event.preventDefault();
      console.log("Si entra");
      var e = jQuery.Event("keyup");
      e.keyCode = $.ui.keyCode.ENTER;
      $("#searchBox").trigger(e);

    },
    'change #location': function (e) {
      if($(e.target).val()!="cualquier"){
       UsersIndex.getComponentMethods().addProps('city', $(e.target).val());
       Session.set("location_selected",$(e.target).val());
     }
     else{
       UsersIndex.getComponentMethods().removeProps('city');  
       Session.set("role_selected",null);
     }
   },
   'change #role': function (e) {
    if($(e.target).val()!="cualquier"){
     UsersIndex.getComponentMethods().addProps('role', $(e.target).val());
     Session.set("role_selected",$(e.target).val());
   }
   else{
     UsersIndex.getComponentMethods().removeProps('role');  
     Session.set("role_selected",null);
   }
 },
 'click .add_collaborator' : function(e, template, doc){
  e.preventDefault();

  var rol = $( "select#sel_"+e.target.value+" option:checked" ).val();
  var projectId = FlowRouter.getParam('id');
  var userId = e.target.value;

  var user = Meteor.users.findOne({'_id':userId});
  if(user){
    var email="";
    user.emails.forEach(function(element) {
      if(element.address != ""){ 
        email=element.address;
      }
    });

    var name="";
    if(user.profile.name!=null && user.profile.name!=""){
      name = user.profile.name;  
    }
    if(user.profile.lastname!=null && user.profile.lastname!=""){
      name = name + " " + user.profile.lastname;
    }
    if(user.profile.lastname2!=null && user.profile.lastname2!=""){
      name = name + " " + user.profile.lastname2;
    }
    console.log("el colaborador se va a armar con los datos siguientes:");

    var collaborator = {
      "_id" : user._id,
      "email": email,
      "role": rol,
      "name" : name,
      "confirmed": true, /*Cambiar esto para activar las notificaciones*/
      "invite_sent": true /*Cambiar esto para activar las notificaciones*/
    };
    console.log(collaborator);

    var exists = Project.find({$and:[{"_id":projectId},{ project_staff: {$elemMatch:{"email":email,"role":rol}}}]});
    if(exists.count()===0){
      console.log("SE va a agregar al colaborador en el proyecto "+projectId);

      Project.upsert(
       {'_id': projectId},
       { $push: { project_staff: collaborator }
     });
      $("#but_"+e.target.value).html('Invitación enviada');
      $("#but_"+e.target.value).attr('disabled', 'disabled');
      $("#sel_"+e.target.value).attr('disabled', 'disabled');
      $("#chk_"+e.target.value).attr('disabled', 'disabled');
      $("#rem_"+e.target.value).show();
    }
  }
},
 'click .remove_collaborator' : function(e, template, doc){
  e.preventDefault();
  var projectId = FlowRouter.getParam('id');
  var userId = e.target.value;
  var user = Meteor.users.findOne({'_id': userId});
  var name="";
  if(user.profile.name!=null && user.profile.name!=""){
    name = user.profile.name;  
  }
  if(user.profile.lastname!=null && user.profile.lastname!=""){
    name = name + " " + user.profile.lastname;
  }
  if(user.profile.lastname2!=null && user.profile.lastname2!=""){
    name = name + " " + user.profile.lastname2;
  }
  if(confirm("¿Eliminar la colaboración de " + name + " de este proyecto?")){

      var email="";
      user.emails.forEach(function(element) {
        if(element.address != ""){ 
          email=element.address;
        }
      });


      var project = Project.findOne({'_id': projectId});
      var rol="";
      if(project){
        var staff = project.project_staff;
        if(staff!=null && staff!=""){
          for (var i = staff.length - 1; i >= 0; i--) {
            if(staff[i]._id === userId){
              rol=staff[i].role;
              break;
            }
          }
        }
      }

      var collaborator = {
       "email": email,
       "role": rol,
       "name" : name
     };

     Project.upsert(
      {'_id': projectId},
      { $pull: { project_staff: collaborator }
    });

     $("#but_"+e.target.value).html('Enviar invitación');
     $("#sel_"+e.target.value).prop('selectedIndex',0);
     $("#chk_"+e.target.value).prop( "checked", false );
     $("#chk_"+e.target.value).removeAttr('disabled');
     $("#rem_"+e.target.value).hide();
   }


 }

});

