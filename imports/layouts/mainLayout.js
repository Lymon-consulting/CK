import { Template } from 'meteor/templating';
import { Params } from '../api/params.js';
import './mainLayout.html';


Template.mainlayout.helpers({
  currentUser: function() {
    return Meteor.userId();
  }
});


Template.registerHelper('isVerified', function(){
  var result = false;
  user = Meteor.user();
  
  if(user!=null){
    if(user.emails[0]!=null && user.emails[0].verified){
      result = true;
    }
    else{
      if(user.isCrew!=null && !user.isCrew){
        result = true;  
      }
      if(user.isCast!=null && !user.isCast){
        result = true;
      }
    }
      
  }
  return result;
});

Template.registerHelper('notSameUser', function(){
  val = true;
  if(FlowRouter.getParam('id')=== Meteor.userId()){
     val = false;
  }
  return val;
});

Template.registerHelper('hasPermission', function(){
  var val = false;
  if(FlowRouter.getParam('id')=== Meteor.userId()){
     val = true;
  }
  return val;
});

Template.registerHelper('firstName', function(){
 return Meteor.user().profile.name;
});

Template.registerHelper('lastName', function(){
 return Meteor.user().profile.lastname;
});

Template.registerHelper('lastName2', function(){
 return Meteor.user().profile.lastname2;
});


Template.registerHelper('viewAsCrew', function(){
  var result = false;
  if(Meteor.user() && Meteor.user().viewAs){
    if(Meteor.user().viewAs===1){ //usuario elige ver como crew
      result = true;
    }
  }
  return result;
});

Template.registerHelper('viewAsCast', function(){
  var result = false;
  if(Meteor.user() && Meteor.user().viewAs){
    if(Meteor.user().viewAs===2){ //usuario elige ver como cast
      result = true;
    }
  }
  return result;
});

Template.registerHelper('isBoth', function(){
  var result = false;
  var user = Meteor.user();
  if(user){
    if(user.isCrew!=null && user.isCrew && user.isCast!=null && user.isCast){
      result = true;
    }
  }
  return result;
});
/*
Template.registerHelper('isCast', function(){
  var result = false;
  if(Meteor.user()){
    if(Session.get("viewAs")!=null){//Existe la variable en sesión
      if(Session.get("viewAs")==="cast"){//El usuario eligió ver como cast
        result = true;
      }
      else{//El usuario NO eligió ver como crew
        result = false;
      }
    }
    else{ //no existe la variable en sesión, consultar en la BD
      if(Meteor.user().isCast!=null && Meteor.user().isCast){
        result=true;
      }      
    }
  }
  return result;
});

Template.registerHelper('isCrew', function(){
  var result = false;
  if(Meteor.user()){
    if(Session.get("viewAs")!=null){//Existe la variable en sesión
      if(Session.get("viewAs")==="crew"){//El usuario eligió ver como crew
        result = true;
      }
      else{//El usuario NO eligió ver como crew
        result = false;
      }
    }
    else{ //no existe la variable en sesión, consultar en la BD
      if(Meteor.user().isCrew!=null && Meteor.user().isCrew){
        result=true;
      }
    }
  }
  return result;
});



Template.registerHelper('viewAs',function(){
  var userPreference = null;

  if(Session.get("viewAs")!=null){
    userPreference = Session.get("viewAs");
  }
  else{
    if(Meteor.user().isCrew!=null && Meteor.user().isCrew){
      userPreference = "crew";
    }
    else if(Meteor.user().isCast!=null && Meteor.user().isCast){
      userPreference = "cast";
    }
  }
  return userPreference;
});
*/
Template.registerHelper('fullName', function(){
 var fullName = "";
 if(Meteor.user()!=null && Meteor.user().profile!=null){
   Meteor.user().profile.name + " " + Meteor.user().profile.lastname + " " + Meteor.user().profile.lastname2;
   if(Meteor.user().profile.name!=null && Meteor.user().profile.name!=""){
     fullName = Meteor.user().profile.name;
   }
   if(Meteor.user().profile.lastname!=null && Meteor.user().profile.lastname!=""){
     fullName = fullName + " " + Meteor.user().profile.lastname;
   }
   if(Meteor.user().profile.lastname2!=null && Meteor.user().profile.lastname2!=""){
     fullName = fullName + " " + Meteor.user().profile.lastname2;
   }
 }
 return fullName;
});

Template.registerHelper('hasTopRole', function(){
  var array = new Array();
  var result = false;
  if(Meteor.user()!=null && Meteor.user().topRole!=null){
    array = Meteor.user().topRole;
    for (var i = array.length - 1; i >= 0; i--) {
      if(array[i]==="1" || array[i]==="2" || array[i]==="3" || array[i]==="4"){
        result = true;  
        break;
      }
    }
  }
  return result;
});

Template.registerHelper('formatURL', function(url){
  if(url!=""){
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;  
    }
  }
  return url;
});


Template.mainlayout.events({
  'click .resend-verification-link' ( event, template ) {
    Meteor.call( 'sendVerificationLink', ( error, response ) => {
      if ( error ) {
        console.log(error);
      } else {
        //let email = Meteor.user().emails[ 0 ].address;
        //Bert.alert({message: `El correo de verificación ha sido enviado a ${ email }`, type: 'success', icon: 'fa fa-check'});
      }
    });
  }
});
