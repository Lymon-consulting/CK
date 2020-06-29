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
        } 
        else {
          var fullname = firstName + " " + lastName;
          Meteor.call('updateFullName', Meteor.userId(), fullname);

          /*Para reactivar el envío de mail de verificación 
          quitar el siguiente bloque y descomentar el bloque de abajo*/

          /*Inicia bloque de auto verificación para nuevos usuarios sin envío de mail*/
          Meteor.users.update(Meteor.userId(), { $set:
            {
              "emails.0.verified": true
            }
          });
          FlowRouter.go('/selectProfile');
          /*Termina bloque de auto verificación*/
          

          /*Inicia bloque de envío de mail de verificación*/
          /*Meteor.call( 'sendVerificationLink', ( error, response ) => {
            if ( error ) {
              console.log(error.reason);
            } else {
              FlowRouter.go('/verify');
            }
          });*/
          /*Termina bloque de envío de mail de verificación*/
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