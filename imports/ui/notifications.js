import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { getPicture } from '/lib/functions.js';
import { timeSince } from '/lib/functions.js';

import './notifications.html'; 
import '/lib/common.js';

Template.notifications.helpers({
 getAlerts(){
  Meteor.subscribe("otherUsers");
  var alerts = new Array();

  if(Meteor.user()){
    var user = Meteor.users.findOne({'_id':Meteor.userId()},{sort:{'alerts.date': -1}});
    if(user){
      alerts = user.alerts; 
    }

  }
  return alerts;
},
getUrl(id){
  return getPicture(id,40);
},
getNameAndURL(userId){
  var user = Meteor.users.findOne({'_id':userId});
  var fullname;
  var url = "";
  if(user){
    fullname = user.fullname;
    if(user.isCrew){
      url = "<a href='/profilePage/"+userId+"'>";
    }
    else{
      url = "<a href='/profilePageActor/"+userId+"'>"; 
    }
  } 
  return url + fullname + "</a>";
},
formatTime(date){
  return timeSince(date);
},
formatAlert(thisAlert){
 var msg = "";
 var user;
 var url;
 var initials;
     if(thisAlert.type===0){ //admin

     }
     else if(thisAlert.type===1){ //like

     }
     else if(thisAlert.type===2){//follow
        msg = " ha comenzado a seguirte ";
    }
     else if(thisAlert.type===3){//collaborator

     }
     else if(thisAlert.type===4){//request

     }
     else if(thisAlert.type===5){//missing info

     }
     else if(thisAlert.type===6){//

     }
     return msg;
   },
   isRead(value){
     var result = "";
     console.log(value);
     if(value){
       result = "notificationRead";
     }
     else{
       result = "notificationNoRead";
     }
     return result;
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