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
   }
});