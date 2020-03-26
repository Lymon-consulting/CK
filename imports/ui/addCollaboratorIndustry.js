import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Industry } from '../api/industry.js';
import { Ocupation } from '../api/ocupations.js';
import { Media } from '../api/media.js';

import './addCollaboratorIndustry.html';

Template.availableProjectsForIndustry.helpers({
  collaboratorName(){
    var name = "";
    if(Session.get("collaborator")!=null && Session.get("collaborator")!=""){
      var company = Industry.findOne({'_id':Session.get("collaborator")});
      if(company){
        name = company.company_name;
      }
    }
    return name;
  },
  myProjects(){      
    Meteor.subscribe('myProjects');
    return Project.find({'userId':Meteor.userId()}).fetch();
  },
  getProjectPicture(projectId, size) {
    Meteor.subscribe("allMedia");
      var data = Project.findOne({'_id' : projectId});
      var url;
      if(data!=null && data.projectPictureID!=null){
        var cover = Media.findOne({'mediaId':data.projectPictureID});
        if(cover!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_scale" + "/v" + cover.media_version + "/" + Meteor.userId() + "/" + data.projectPictureID;    
        }
        
      }
      return url;
  },
  checkParticipation(projectId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': projectId});
    var result="";
    if(project){
      var companies = project.companies;
      if(companies!=null && companies!=""){
        for (var i = companies.length - 1; i >= 0; i--) {
          if(companies[i]._id === Session.get("collaborator")){
            result="checked";
            break;
          }
        }
      }
    }
    return result;
  }
});

Template.availableProjectsForIndustry.events({
  'click input': function(event) {
    if(event.target.checked){
    //var selectedProject = event.target.id;
    //console.log("true");
    //console.log(event.target.value);
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
'click .add_collaborator' : function(e, template, doc){
  e.preventDefault();

  //var rol = $( "select#sel_"+e.target.value+" option:checked" ).val();
  var projectId = e.target.value

  var company = Industry.findOne({'_id':Session.get("collaborator")});
  if(company){
    

    var name=company.company_name;
    
    
    var collaborator = {
      "_id" : company._id,
      "name" : name,
      "confirmed": true, /*Cambiar esto para activar las notificaciones*/
      "invite_sent": true /*Cambiar esto para activar las notificaciones*/
    };

    var exists = Project.find({$and:[{"_id":projectId},{ companies: {$elemMatch:{"_id":company._id}}}]});
    
    if(exists.count()===0){

      Project.upsert(
       {'_id': projectId},
       { $push: { companies: collaborator }
     });
      $("#but_"+e.target.value).html('Invitación enviada');
      $("#but_"+e.target.value).hide();
      $("#chk_"+e.target.value).attr('disabled', 'disabled');
      $("#rem_"+e.target.value).show();
    }
  }
},
'click .remove_collaborator' : function(e, template, doc){
  e.preventDefault();
  var projectId = e.target.value
  var company = Industry.findOne({'_id':Session.get("collaborator")});
  var name="";
  if(company){
    name = company.company_name;  
  }
  
  if(confirm("¿Eliminar la colaboración de " + name + " de este proyecto?")){

      var collaborator = {
       "_id": Session.get("collaborator"),
       "name" : name
     };

     Project.upsert(
      {'_id': projectId},
      { $pull: { companies: collaborator }
    });
   


   $("#but_"+e.target.value).html('Enviar invitación');
     //$("#but_"+e.target.value).removeAttr('disabled');
     //$("#sel_"+e.target.value).removeAttr('disabled');
     $("#chk_"+e.target.value).prop( "checked", false );
     $("#chk_"+e.target.value).removeAttr('disabled');
     $("#rem_"+e.target.value).hide();
   }


 }
});