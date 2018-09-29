import { Template } from 'meteor/templating';

import './userPage.html';

Template.userPage.helpers({
  userFullName(){
    if (Meteor.user()){
      return Meteor.user().profile.name + " " + Meteor.user().profile.lastname + " " +Meteor.user().profile.lastname2;
    }
    else{
      return "Nada";
    }
  }
});



Template.user.helpers({
   name(){
      if(Meteor.user()){
         return Meteor.user().profile.name;
      }
   },
   lastname(){
      if(Meteor.user()){
         return Meteor.user().profile.lastname;
      }
   },
   lastname2(){
      if(Meteor.user()){
         return Meteor.user().profile.lastname2;
      }
   }
});

Template.user.events({
  'click #updateName': function(event, template) {
   event.preventDefault();
   var name, lastname, lastname2;
  
   name = $('#personName').val();
   lastname = $('#personLastName').val();
   lastname2 = $('#personLastName2').val();

   if(name!="" || lastname!="" || lastname2!=""){
      console.log('Actualizando nombre del usuario ' + name + " " + lastname + " " + lastname2);
      
      Meteor.users.update({_id: Meteor.userId()}, {$set: 
         {"profile.name": name, 
          "profile.lastname": lastname, 
          "profile.lastname2": lastname2
         }
      });
      
      $('#personName').val("");
      $('#personLastName').val("");
      $('#personLastName2').val("");
      sAlert.success('Tu nombre ha sido actualizado',{});
   }
   else{
      sAlert.error('Los campos no pueden estar vacíos',{});   
   } 
      
     
  }
});


Template.firstSetOfInformation.helpers({
   resume(){
      if(Meteor.user()){
         return Meteor.user().profile.resume;
      }
   },
   webpage(){
      if(Meteor.user()){
         return Meteor.user().profile.webpage;
      }
   },
   facebook(){
      if(Meteor.user()){
         return Meteor.user().profile.facebook;
      }
   },
   twitter(){
      if(Meteor.user()){
         return Meteor.user().profile.twitter;
      }
   },
   vimeo(){
      if(Meteor.user()){
         return Meteor.user().profile.vimeo;
      }
   },
   youtube(){
      if(Meteor.user()){
         return Meteor.user().profile.youtube;
      }
   },
   instagram(){
      if(Meteor.user()){
         return Meteor.user().profile.instagram;
      }
   }

});

Template.firstSetOfInformation.events({
   'click #guardar_set1': function(event, template){
      console.log('Entrando a la función');
      
      event.preventDefault();
      var ocupation, resume, webpage, facebook_page, twitter, vimeo, youtube, instagram;
      ocupation = $('#ocupation').val(); 
      resume = $('#resume').val();
      webpage = $('#web_page').val();
      facebook = $('#facebook_page').val();
      twitter = $('#twitter_page').val();
      vimeo = $('#vimeo_page').val();
      youtube = $('#youtube_page').val();
      instagram = $('#instagram_page').val();
      userId = Meteor.userId();

      console.log('Actualizando los datos de '+ userId);
      Meteor.users.update({_id: Meteor.userId()}, {$set: {
         "profile.resume": resume, 
         "profile.webpage": webpage, 
         "profile.facebook": facebook,
         "profile.twitter": twitter,
         "profile.vimeo": vimeo,
         "profile.youtube": youtube,
         "profile.instagram": instagram
      }});
      console.log('Datos actualizados');
   }
});