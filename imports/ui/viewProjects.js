import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';

import './viewProjects.html';
import '/lib/common.js';


if (Meteor.isClient) {

   Template.userProjects.helpers({
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
      getUserProjects(){
         if (Meteor.user()){
            return Project.find({userId: "aKrDvCpnhA3tik8Ws"}).fetch(); 
         }
         else{
           return "Nada";
         }
      }      
   });

}
