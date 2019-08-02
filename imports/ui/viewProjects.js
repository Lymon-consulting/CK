import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import './viewProjects.html';



Meteor.subscribe('myProjects');
Meteor.subscribe("userData");
//Meteor.subscribe("cover");

if (Meteor.isClient) {

   Template.viewProjects.helpers({
     userFullName(){
      var fullname = "";
       if (Meteor.user()){
         fullname = Meteor.user().profile.name + " " + Meteor.user().profile.lastname; 
         if(Meteor.user().profile.lastname2!=null){
           fullname = fullname + " " +Meteor.user().profile.lastname2;
         }
         return fullname;
       }
       else{
         return "Nada";
       }
     }
   });


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
          var url = "";
          var data = Project.findOne({'_id' : projectId});
          if(data!=null && data.projectPictureID!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.projectPictureID;
          }
         return url;
      },
      wizard(){
       return Meteor.user().wizard;
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