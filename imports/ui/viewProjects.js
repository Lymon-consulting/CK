import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import './viewProjects.html';



Meteor.subscribe('myProjects');
Meteor.subscribe("cover");

if (Meteor.isClient) {

   Template.viewProjects.helpers({
     userFullName(){
       if (Meteor.user()){
         return Meteor.user().profile.name + " " + Meteor.user().profile.lastname + " " +Meteor.user().profile.lastname2;
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
      coverPicture(projID) {
         if(Meteor.user()){
            return Cover.find({'project_id': projID});
         }
      }
   });

   Template.projectList.events({
      'change #proj_main': function(event, template) {
         event.preventDefault();
         var element = template.find('input:radio[name=selectMain]:checked');
         id = $(element).val();
         otherProjects = Project.find({userId: Meteor.userId()}).fetch();
         otherProjects.forEach(function(current_value) {
            Project.update({_id: current_value._id},{$set:{"project_is_main": "" }});       
         });
         Project.update({_id: id},{$set:{"project_is_main": "true" }});       
      }
   });
}