import { Template } from 'meteor/templating';

import './join.html';

Template.join.events({
  'submit form': function(event){
    event.preventDefault();
    NProgress.start(); //Starts progress bar
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();
    var firstName = $('[name=firstName]').val();
    var lastName = $('[name=lastName]').val();
    
    if(isNotEmpty(email) && isNotEmpty(password) && isNotEmpty(firstName) && isNotEmpty(lastName)){

      let user = {
        email: email,
        password: password,
        profile: {
          name: firstName,
          lastname: lastName
        }
      };

      Accounts.createUser( user, ( error ) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          Meteor.call( 'sendVerificationLink', ( error, response ) => {
            if ( error ) {
              console.log(error.reason);
            } else {
              FlowRouter.go('/confirmProfile');
            }
          });
        }
      });
    }
    else{
      Bert.alert({message: 'Los datos no pueden estar vacíos', type: 'danger', icon: 'fa fa-times'});
    }
    NProgress.done(); //Ends progress bar
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