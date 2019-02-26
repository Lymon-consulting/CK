import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Project } from '../api/project.js';
 
import './header.html';
import './projectPage.html';
import '/lib/common.js';

Template.header.helpers({
  user(){
      return Meteor.user();
  }
});


Template.notifications.helpers({
   getAlerts(){
      var email = "";
      Meteor.subscribe("otherUsers");
      var user = Meteor.users.findOne({"_id" : Meteor.userId()});
      var proyecto = "";
      if(user){
         email = user.emails[0].address;
         userId = user._id;
         var found = Project.find({"$and":[{"project_staff.email": email, "project_staff.confirmed":false}]});

         var alertsFound = new Array();
         if(found){

            found.forEach(function(item){

               var owner = Meteor.users.findOne({_id : item.userId});

               for(var i=0; i<item.project_staff.length; i++){
                  if(item.project_staff[i].email === email && !item.project_staff[i].confirmed){
                     
                     var alert = {
                        "title": item.project_title, 
                        "projectID": item._id,
                        "owner": owner.profile.fullname, 
                        "ownerID": owner._id, 
                        "role": item.project_staff[i].role,
                        "collabID": item.project_staff[i]._id
                     };
                     
                     //console.log(alert);
                     alertsFound.push(alert);
                  }
               }

            });
            //console.log("Tamaño del arreglo: " + alertsFound.length);
         }

      }
      return alertsFound;
   }
});

Template.notifications.events({
   'click .confirmCollaboration' : function(e, template, doc){
       e.preventDefault();

       var id = $(e.target).attr('data-id');
       var proj = $(e.target).attr('data-proj');
       Meteor.call(
         'updateConfirmation',
         proj,
         id,
         true
       );
   }
});

