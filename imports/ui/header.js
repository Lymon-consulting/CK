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
                        "ownerEmail": owner.emails[0].address,
                        "role": item.project_staff[i].role,
                        "collabID": item.project_staff[i]._id,
                        "collabEmail": item.project_staff[i].email
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

       Bert.alert({message: 'Has confirmado tu participación en el proyecto', type: 'info'});
   },
   'click .denyColaboration' : function(e, template, doc){
      e.preventDefault();

      if(confirm("Estás a punto de eliminar tu participación en este proyecto, ¿estas seguro?")){
         var proj = $(e.target).attr('data-proj');
         var id = $(e.target).attr('data-id');
         var ownerEmail = $(e.target).attr('data-ownerEmail');
         var collabEmail = $(e.target).attr('data-collabEmail');
         var title = $(e.target).attr('data-title');
         var collabRole = $(e.target).attr('data-collabRole');

         console.log("En el cliente eliminando a: "+ id +", " + collabEmail +", " +  collabRole );

         Meteor.call(
            'deleteCollaboration',
            proj,
            id,
            collabEmail,
            collabRole
         );


         Bert.alert({message: 'Has eliminado tu participación en el proyecto', type: 'info'});

         var emailData = {
           title: title,
           collabEmail: collabEmail,
           collabRole: collabRole
         };

         console.log("Enviando correo a " + ownerEmail);
         
         Meteor.call(
           'sendEmail',
           ownerEmail,
           'Carlos <lcjimenez@gmail.com>',
           'Un colaborador ha rechazado su participación en tu proyecto de Cinekomuna',
           'deny-collaboration-template.html',
           emailData
         );
      }

   }
});

