import { Template } from 'meteor/templating';
import './mainLayout.html';


Template.mainlayout.helpers({
  currentUser: function() {
    return Meteor.userId();
  }
});

Template.registerHelper('isVerified', function(){
  let result = false;
  user = Meteor.user();


  if(user!=null && user.emails[0]!=null && user.emails[0].verified){
    result = true;
  }
  return result;
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
      if(Meteor.user().profileType){
        if(Meteor.user().profileType==="cast"){ //El valor en la BD es cast
          result = true;
        }
        else if(Meteor.user().profileType==="both"){//El valor en la BD es both
          result = true;
        }
      }
      else{//El valor en la BD no es crew ni both, debe ser crew
        result = false;
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
      if(Meteor.user().profileType){
        if(Meteor.user().profileType==="crew"){ //El valor en la BD es crew
          result = true;
        }
        else if(Meteor.user().profileType==="both"){//El valor en la BD es both
          result = true;
        }
      }
      else{//El valor en la BD no es crew ni both, debe ser cast
        result = false;
      }
    }
  }
  return result;
});

Template.registerHelper('isBoth', function(){
  var result = false;
  if(Meteor.user()){
    if(Meteor.user().profileType){
      if(Meteor.user().profileType==="both"){
        result = true;
      }
    }
    else{
      return false;
    }
  }
  return result;
});

Template.registerHelper('viewAs',function(){
  var userPreference = null;
  console.log("A--->"+Session.get("viewAs"));

  if(Session.get("viewAs")!=null){
    userPreference = Session.get("viewAs");
  }
  else{
    userPreference = Meteor.user().profileType;

  }
  console.log("B--->"+userPreference);
  return userPreference;
});

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
  if(Meteor.user().role!=null){
    array = Meteor.user().role;
    for (var i = array.length - 1; i >= 0; i--) {
      if(array[i]==="Director"){
        result = true;  
      }
      if(array[i]==="Productor"){
        result = true;  
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
        let email = Meteor.user().emails[ 0 ].address;
        Bert.alert({message: `El correo de verificación ha sido enviado a ${ email }`, type: 'success', icon: 'fa fa-check'});
      }
    });
  }
});
