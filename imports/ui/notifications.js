import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { Alert } from '../api/alert.js';
import { Industry } from '../api/industry.js';
import { getPicture } from '/lib/functions.js';
import { timeSince } from '/lib/functions.js';

import './notifications.html'; 
import '/lib/common.js';

Meteor.subscribe("alerts");
Template.notifications.helpers({
 getAlerts(){
  const alerts = Alert.find({
      "receiver": Meteor.userId(),
      "read":false
    },
    {sort:{
      'date':-1
    }
  }).fetch();
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
  let user = Meteor.users.findOne({'_id':userId});
  let initials="";
  if(user){
    let name = user.profile.name;
    let lastname = user.profile.lastname;
    initials = name.charAt(0) + lastname.charAt(0);
  
  }
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
     Meteor.subscribe("alerts");
      const alerts = Alert.find({"receiver": Meteor.userId(),"read":false}).fetch();
      let count = 0;
      console.log(alerts);
      if(alerts){
        count = alerts.length;
      }
      if(count>0){
        return count;
      }
      else{
        return null;
      }
      
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
    let from = $(event.currentTarget).attr("data-id")
    let url = "";
    console.log(from);
    var user = Meteor.users.findOne({'_id':from});
    if(user!=null && user.isCrew){
      url = "/profilePage/";
    }
    else if(user!=null && user.isCast){
      url = "/profilePageActor/"; 
    }
    FlowRouter.go(url+from);
 },
 'click .fa-eye': function(event,template){
   event.preventDefault();
   alertId = $(event.currentTarget).attr("data-id")
   console.log(alertId);
   if(alertId){
    Meteor.call(
      'markAlertAsRead',
      alertId,
      true);
   }
   
 }
});