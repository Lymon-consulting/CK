import { Template } from 'meteor/templating';
import { getParam } from '/lib/functions.js';

import './login.html';

Template.login.events({
  'submit form': function(event){
    event.preventDefault();
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();

    if(isNotEmpty(email) && isNotEmpty(password)){
      Meteor.loginWithPassword(email, password, function(error){
        if(error){
          console.log(error);
          if(error.error==403){
            $('[name=email]').val("");
            $('[name=password]').val("");
            Bert.alert({message: 'Usuario o contraseña incorrectos', type: 'danger', icon: 'fa fa-lock'});
          }
        } 
        else{
          var user = Meteor.user();
          //console.log(getParam("SEND_VERIFICATION_MAIL"));
          if(getParam("SEND_VERIFICATION_MAIL")){
            console.log("A");
            if(user.emails[0]!=null && user.emails[0].verified){
              console.log("B");
              FlowRouter.go('/peopleList');
            }
            else{
              console.log("C");
              FlowRouter.go('/verify'); 
              Session.keys = {};
              Meteor.logout();
            }  
          }
          else{
            console.log("D");
            FlowRouter.go('/peopleList');
          }

          
          
        }
      }); 
    }
    else{
      Bert.alert({message: 'El correo y/o la contraseña no pueden estar vacíos', type: 'danger', icon: 'fa fa-times'});
    }




  },
  'click .join': function(event){
    event.preventDefault();
    FlowRouter.go('/join');
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