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

Template.registerHelper('fullName', function(){
   var fullName = "";
   if(Meteor.user()!=null && Meteor.user().profile!=null){
     Meteor.user().profile.name + " " + Meteor.user().profile.lastname + " " + Meteor.user().profile.lastname2;
   }
   return Meteor.user().profile.name + " " + Meteor.user().profile.lastname + " " + Meteor.user().profile.lastname2;
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
