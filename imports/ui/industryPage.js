import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';


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
