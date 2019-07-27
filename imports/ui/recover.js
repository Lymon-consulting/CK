import { Template } from 'meteor/templating';

import './recover.html';

Meteor.subscribe('otherUsers');

Template.recover.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();


        
        if(isNotEmpty(email)){
        	event.preventDefault();
        	var user = Meteor.users.findOne({"emails.address": email});
        	if(user){
		        Meteor.call( 'sendResetPasswordEmail', user._id , ( error, response ) => {
		            if ( error ) {
		              console.log(error.reason);
		            } else {
		              FlowRouter.go('/');
		            }
		          });
		    }
        }
        else{
        	Bert.alert({message: 'El correo y/o la contraseña no pueden estar vacíos', type: 'danger', icon: 'fa fa-times'});
        }
    }
});

var isNotEmpty=function(val){
  if(val && val!== ""){
    return true;
  }
//  Bert.alert("", "danger", "growl-top-right");
  Bert.alert({message: 'Por favor completa todos los campos obligatorios', type: 'danger', icon: 'fa fa-exclamation'});
  return false;
}