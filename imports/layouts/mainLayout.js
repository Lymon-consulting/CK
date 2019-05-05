import { Template } from 'meteor/templating';
 
import './mainLayout.html';

Template.mainlayout.helpers({
  currentUser: function() {
    return Meteor.userId();
  }

});

/*
Template.registerHelper('Ocupations', function () {
   Alphas = ['Actor',
           'Bailarín', 'Camarógrafo', 'Director','Escenógrafo', 'Fotógrafo',
           'Gaffer', 'Iluminador','Productor','Tramoyista'];
   return Alphas;
});*/

Template.registerHelper('firstName', function(){
   return Meteor.user().profile.name;
});

Template.registerHelper('lastName', function(){
   return Meteor.user().profile.lastname;
});

Template.registerHelper('lastName2', function(){
   return Meteor.user().profile.lastname2;
});
