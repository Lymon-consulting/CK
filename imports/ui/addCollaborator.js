import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Ocupation } from '../api/ocupations.js';

import './addCollaborator.html';

Template.availableProjects.helpers({
  collaboratorName(){
    var name = "";
    if(Session.get("collaborator")!=null && Session.get("collaborator")!=""){
      Meteor.subscribe("otherUsers");
      var user = Meteor.users.findOne({'_id':Session.get("collaborator")});
      if(user){
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
  myProjects(){      
    Meteor.subscribe('myProjects');
    return Project.find({'userId':Meteor.userId()}).fetch();
  },
  getAllOcupations(){
   return Ocupation.find({},{sort:{"secondary":1}}).fetch();
  },
  getProjectPicture(projectId, size) {
    var url = "";
    var data = Project.findOne({'_id' : projectId});
    if(data!=null && data.projectPictureID!=null){
      url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.projectPictureID;
    }
    return url;
  },
  checkParticipation(projectId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': projectId});
    var result="";
    if(project){
      var staff = project.project_staff;
      if(staff!=null && staff!=""){
        for (var i = staff.length - 1; i >= 0; i--) {
          if(staff[i]._id === Session.get("collaborator")){
            result="checked";
            $("#chk_"+projectId).attr('disabled', 'disabled');
            break;
          }
        }
      }
    }
    return result;
  },
  getRole(projectId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': projectId});
    var result="";
    if(project){
      var staff = project.project_staff;
      if(staff!=null && staff!=""){
        for (var i = staff.length - 1; i >= 0; i--) {
          if(staff[i]._id === Session.get("collaborator")){
            result=staff[i].role;
            break;
          }
        }
      }
    }
    return result;
  }
});

Template.availableProjects.events({
  'click input': function(event) {
    if(event.target.checked){
    //var selectedProject = event.target.id;
    //console.log("true");
    //console.log(event.target.value);
    $("#sel_"+event.target.value).removeAttr('disabled');
    $("#but_"+event.target.value).removeAttr('disabled');
  }
  else{
   //console.log("false");
   $("#sel_"+event.target.value).attr('disabled', 'disabled');
   $("#but_"+event.target.value).attr('disabled', 'disabled');
 }
},
'click .add_collaborator' : function(e, template, doc){
  e.preventDefault();

  var rol = $( "select#sel_"+e.target.value+" option:checked" ).val();
  var projectId = e.target.value

  var user = Meteor.users.findOne({'_id':Session.get("collaborator")});
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
      "confirmed": false,
      "invite_sent": false
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
  var projectId = e.target.value
  var user = Meteor.users.findOne({'_id':Session.get("collaborator")});
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

    var user = Meteor.users.findOne({'_id':Session.get("collaborator")});
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
      var rol = $( "select#sel_"+e.target.value+" option:checked" ).val();
      console.log("va a borrar="+name + ", " + email + ", " + rol + " del proyecto "+projectId);

      var collaborator = {
       "email": email,
       "role": rol,
       "name" : name
     };

     Project.upsert(
      {'_id': projectId},
      { $pull: { project_staff: collaborator }
    });
   }


   $("#but_"+e.target.value).html('Enviar invitación');
     //$("#but_"+e.target.value).removeAttr('disabled');
     //$("#sel_"+e.target.value).removeAttr('disabled');
     $("#sel_"+e.target.value).prop('selectedIndex',0);
     $("#chk_"+e.target.value).prop( "checked", false );
     $("#chk_"+e.target.value).removeAttr('disabled');
     $("#rem_"+e.target.value).hide();
   }


 }
});