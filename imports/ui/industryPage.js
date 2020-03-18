import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Project } from '../api/project.js';

import './industryPage.html';
Meteor.subscribe("otherUsers");
Template.industryPage.helpers({
 getCompany(){
  return Industry.findOne({_id : FlowRouter.getParam('id')});
},
isOwner(){
  industry = Industry.findOne({'_id': FlowRouter.getParam('id')});
  if(industry!=null && industry.userId === Meteor.userId()) {
   val = true;
 }
 else{
   val = false;
 }
 return val;
},
getProjects(){
  Meteor.subscribe("myProjects", FlowRouter.getParam('id'));
      //return Project.find({$and : [ {'userId' : FlowRouter.getParam('id')} , {"project_is_main": '' }]});
      return Project.find({'userId' : FlowRouter.getParam('id')});
    },

    getMainProject(){
      Meteor.subscribe("myMainProject", FlowRouter.getParam('id'));
      return Project.findOne({'userId': FlowRouter.getParam('id'), 'project_is_main' : 'true'});
    },
    getProjectImages(projId, size){
      var url = "";
      var data = Project.findOne({'_id' : projId});
      if(data!=null && data.projectPictureID!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_scale/" + data.projectPictureID;
      }
      return url;
    },
    notSameUser(){
      val = true;
      if(FlowRouter.getParam('id')=== Meteor.userId()){
       val = false;
     }
     return val;
   },
   getCoverPicture() {
     var url = "";
     var company = Industry.findOne({'_id':FlowRouter.getParam('id')});
     if(company!=null && company.companyCoverID!=null && company.companyCoverID!=""){
      url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_1200,h_250,c_fill/" + company.companyCoverID;
    }
    return url;
  },
  getLogoPicture(size) {
   var url = "";
   var company = Industry.findOne({'_id':FlowRouter.getParam('id')});
   if(company!=null && company.companyLogoID!=null && company.companyLogoID!=""){
    url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_fill/" + company.companyLogoID;
  }
  return url;
}
});

Template.company_crew.helpers({
  getCrew(){
   var collabs = null;
   var company = Industry.findOne({"_id": FlowRouter.getParam('id')});
   if(company){
    collabs = company.company_staff;
  }
  return collabs;
},
profilePicture(userId){
 return Images.find({'owner': userId});
},
getProfilePicture(userId) {
 var url = "";
 var user = Meteor.users.findOne({'_id':userId});
 if(user!=null && user.profilePictureID!=null && user.profilePictureID!=""){
  url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_100,h_100,c_thumb,r_max/" + user.profilePictureID;
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
}
});

Template.company_projects.helpers({

  getCompanyProjects(){
    Meteor.subscribe("allProjects");
    var companyProjects = Project.find({ 'companies._id': { $all : [FlowRouter.getParam('id')]}});
    console.log(companyProjects);
    return companyProjects;
  },
  getProjectPicture(projectId, size) {
    var url = "";
    var data = Project.findOne({'_id' : projectId});
    if(data!=null && data.projectPictureID!=null){
      url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.projectPictureID;
    }
    return url;
  }
});

Template.industryPage.events({
  'click #cancel': function(event,template,doc){
    $('#collabModal').modal('toggle');
  },
  'click #search': function(event,template,doc){
            /*$('#collabModal').modal('toggle');
            FlowRouter.go('/searchCollaborator/' + FlowRouter.getParam('id')); */
            $('#collabModal')
            .on('hidden.bs.modal', function() {
              FlowRouter.go('/searchCollaboratorForIndustry/' + FlowRouter.getParam('id'));
            })
            .modal('hide');
          }
        });