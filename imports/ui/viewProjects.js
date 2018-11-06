import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import './viewProjects.html';


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
      return Project.find({userId: Meteor.userId()}).fetch();
   },
   isMainProject: function(value){
     var main = Project.findOne({'_id': value}).project_is_main;
     return (main === 'true') ? 'checked' : '' ; 
   }
});

Template.projectList.events({
   'change #proj_main': function(event, template) {
      event.preventDefault();
      var element = template.find('input:radio[name=selectMain]:checked');
      id = $(element).val();
      console.log("El  id del proyecto es: " +id);
      otherProjects = Project.find({userId: Meteor.userId()}).fetch();
      otherProjects.forEach(function(current_value) {
         Project.update({_id: current_value._id},{$set:{"project_is_main": "" }});       
      });
      Project.update({_id: id},{$set:{"project_is_main": "true" }});       
   }
});