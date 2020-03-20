import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import './viewProjects.html';



Meteor.subscribe('myProjects');
Meteor.subscribe("userData");
//Meteor.subscribe("cover");

if (Meteor.isClient) {

   Template.projectList.helpers({
      myProjects(){      
         Meteor.subscribe('myProjects');
         return Project.find({'userId':FlowRouter.getParam('id')}).fetch();
      },
      isMainProject(value){
        var main = Project.findOne({'_id': value}).project_is_main;
        return (main === 'true') ? 'checked' : '' ; 
      },
      getProjectPicture(projectId, size) {
        Meteor.subscribe("allMedia");
        var data = Project.findOne({'_id' : projectId});
        var url;
        if(data!=null && data.projectPictureID!=null){
          var cover = Media.findOne({'mediaId':data.projectPictureID});
          if(cover!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_fill" + "/v" + cover.media_version + "/" + Meteor.userId() + "/" + data.projectPictureID;    
          }
          
        }
        return url;
        /*
          var url = "";
          var data = Project.findOne({'_id' : projectId});
          if(data!=null && data.projectPictureID!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.projectPictureID;
          }
         return url;*/
      },
      wizard(){
        if(Meteor.user()!=null && Meteor.user().wizard!=null){
          return Meteor.user().wizard;
        }

     }
   });

   Template.projectList.events({
      'change #proj_main': function(event, template) {
         event.preventDefault();
         Meteor.subscribe("userData");
         var element = template.find('input:radio[name=selectMain]:checked');
         id = $(element).val();
         otherProjects = Project.find({userId: Meteor.userId()}).fetch();
         otherProjects.forEach(function(current_value) {
            Project.update({_id: current_value._id},{$set:{"project_is_main": "" }});       
         });
         Project.update({_id: id},{$set:{"project_is_main": "true" }});       
      },
      'click .closeModal ': function (event){
        event.preventDefault();
        $('#myModal').hide();
      },
      'click #hideWizard' : function(event){
        event.preventDefault();
        
        Meteor.call('hideWizard');

        $('#myModal').hide();
      }
   });
}