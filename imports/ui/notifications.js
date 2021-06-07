import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { Industry } from '../api/industry.js';
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
thisUser(){
  return Meteor.userId();
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
      fullname = user.fullname;
    }
  } 
  return url + fullname + "</a>";
},
getInitials(userId){
  var user = Meteor.users.findOne({'_id':userId});
  var name = user.profile.name;
  var lastname = user.profile.lastname;
  var initials = name.charAt(0) + lastname.charAt(0);
  return initials;
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
     else if(thisAlert.type===2){//follow profile
        msg = " ha comenzado a seguirte ";
    }
     else if(thisAlert.type===3){//follow company
        msg = " sigue ahora a "
     }
     else if(thisAlert.type===4){//collaboration
       msg = " ha indicado que colaboraste en "
     }
     else if(thisAlert.type===5){//missing info

     }
     else if(thisAlert.type===6){//missing info

     }
     return msg;
   },
   isRead(value){
     var result = "";
     if(value){
       result = "notificationRead";
     }
     else{
       result = "notificationNoRead";
     }
     return result;
   },
   countAlerts(){
    var alerts = new Array();
    var count = null;
    if(Meteor.user()){
      alerts = Meteor.user().alerts;
      if(alerts && alerts.length>0){
        count=0;
        for (var i = 0; i < alerts.length; i++) {
          if(!alerts[i].read){
            count++;
          }
        }
      }
      
    }
    if(count==0){
      count=null;
    }
    return count;
    
   },
   switch(type, value){
      if(type===value){
        return true;
      }
      else{
        return false;
      }
   },
   companyName(companyId){
     var company = Industry.findOne({'_id':companyId});
     var name="";
     if(company){
       name = company.company_name;
     }
     return name;
   },
   projectName(projectId){
    var project = Project.findOne({'_id':projectId});
    var name="";
    if(project){
      name = project.project_title;
    }
    return name;
  },
  getProjectURL(projectId){
    var project = Project.findOne({'_id':projectId});
    var name="";
    if(project){
      name = project.project_title;
    }

    let url = "<a href='/projectPage/"+projectId+"'>" + name + "</a>";
    return url;
  },
  projectRole(projectId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': projectId});
    var result="";
    if(project){
      var staff = project.project_staff;
      if(staff!=null && staff!=""){
        for (var i = staff.length - 1; i >= 0; i--) {
          if(staff[i]._id === Meteor.userId()){
            result=staff[i].role;
            break;
          }
        }
      }
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
   //var ownerEmail = $(e.target).attr('data-ownerEmail');
   //var collabEmail = $(e.target).attr('data-collabEmail');
   //var title = $(e.target).attr('data-title');
   //var collabRole = $(e.target).attr('data-collabRole');

   console.log("En el cliente eliminando a: "+ id);

   Meteor.call(
    'deleteCollaboration',
    proj,
    id
    );


   Bert.alert({message: 'Has eliminado tu participación en el proyecto', type: 'info'});


   

/*
   var emailData = {
     title: title,
     collabEmail: collabEmail,
     collabRole: collabRole
   };*/

   //console.log("Enviando correo a " + ownerEmail);
/*
   Meteor.call(
     'sendEmail',
     ownerEmail,
     'Carlos <lcjimenez@gmail.com>',
     'Un colaborador ha rechazado su participación en tu proyecto de Cinekomuna',
     'deny-collaboration-template.html',
     emailData
     );*/
 }
},
 'click .clickable':function(event,template){
    event.preventDefault();
    userId = $(event.currentTarget).attr("data-id")
    var user = Meteor.users.findOne({'_id':userId});
    if(user.isCrew){
      url = "/profilePage/";
    }
    else{
      url = "/profilePageActor/"; 
    }
    FlowRouter.go(url+userId);
 },
 'click .fa-eye': function(event,template){
   event.preventDefault();
   alertId = $(event.currentTarget).attr("data-id")
   console.log(alertId);
   Meteor.call('markAlertAsRead',Meteor.userId(),alertId,true);
 }
});