import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';

import './profilePage.html';

Template.profilePage.helpers({
   getProfile(){
      
      Meteor.subscribe("otherUsers");
      return Meteor.users.findOne({_id : Session.get('userID')});

   },
   profilePicture(userId){
      
      return Images.find({'owner': userId});
   },
   getProjects(userId){
      return Project.find({'userId': userId}).fetch();
   },
   getMainProject(userId){
      console.log("Buscando proyectos de " + Session.get('userID'));
      return Project.findOne({'userId': Session.get('userID'), 'project_is_main' : 'true'});
   },
   getProjectImages(projId){
      console.log("Buscando imagenes de proyecto "+projId);
      return Cover.find({'project_id': projId});
   }
});

/*
import { Template } from 'meteor/templating';

import './profilePage.html';



Template.profilePage.helpers({
   getProfile(){
      
      Meteor.subscribe("otherUsers");
      return Meteor.users.findOne({_id : Session.get('userID')}); 

   },
   profilePicture(userId){
      console.log("Buscando imagenes de "+userId);
      return Images.find({'owner': userId});
   }
});


*/