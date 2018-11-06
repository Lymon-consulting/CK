import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
 
import './header.html';
import '/lib/common.js';

Template.header.helpers({
  user(){
      return = Meteor.user();
  }
});


Template.header.events({
   'click #openNav': function(event, template) {
      console.log("Abriendo menú");
      event.preventDefault();
      if ($('mySidenav').css("width") != "250px") {
        $('mySidenav').css("width") = "250px";
       } else {
           $('mySidenav').css("width") = "0";
       }  
   }
});

