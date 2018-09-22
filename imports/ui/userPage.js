import { Template } from 'meteor/templating';
import { People } from '../api/people.js';

import './userPage.html';


Template.user.events({
  'click #updateName': function(event, template) {
   event.preventDefault();
   var user, lastname, lastname2;
   $('#personName').val()!="" ? user = $('#personName').val(): user = Meteor.user().profile.name; 
   $('#personLastName').val()!="" ? lastname = $('#personLastName').val(): lastname = Meteor.user().profile.lastname; 
   $('#personLastName2').val()!="" ? lastname2 = $('#personLastName2').val(): lastname2 = Meteor.user().profile.lastname2; 
   if(user!="" || lastname!="" || lastname2!=""){
      console.log('Actualizando nombre del usuario ' + user + " " + lastname + " " + lastname2);
      Meteor.users.update({_id: Meteor.userId()}, {$set: 
         {"profile.name": user, 
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

Template.firstSetOfInformation.events({
   'clic #guardar_set1': function(event, template){
      event.preventDefault();
      var ocupation, resume, web_page, facebook_page, twitter_page, vimeo_page, youtube_page, instagram_page;
      ocupation = $('#ocupation').val(); 

      People.update({$set {
            'userId': Meteor.userId(), 
            'ocupation': ocupation,
            'resume': resume,
            'web_page': web_page,
            'facebook_page': facebook_page,
            'twitter_page': twitter_page,
            'vimeo_page': vimeo_page,
            'youtube_page': youtube_page,
            'instagram_page': instagram_page
         } 
      })

   }
});