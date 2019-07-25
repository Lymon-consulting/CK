import { Template } from 'meteor/templating';

import './join.html';

Template.join.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        var firstName = $('[name=firstName]').val();
        var lastName = $('[name=lastName]').val();
        
        if(isNotEmpty(email) && isNotEmpty(password) && isNotEmpty(firstName) && isNotEmpty(lastName)){
          Accounts.createUser({
            email: email,
            password: password,
            profile: {
              name: firstName,
              lastname: lastName
            }
          }, function(error){
                if(error){
                    console.log(error);
                    if(error.error==403){
                      $('[name=email]').val("");
                      $('[name=password]').val("");
                      Bert.alert({message: 'La cuenta con el correo '+email+' ya existe', type: 'danger', icon: 'fa fa-times'});
                    }
                } else {
                  Meteor.loginWithPassword(email, password);
                  FlowRouter.go('/');
                }
          });  
        }
        else{
          Bert.alert({message: 'Los datos no pueden estar vacíos', type: 'danger', icon: 'fa fa-times'});
        }

        
/*
        Accounts.createUser({
          email: email,
          password: password,
          profile: {
            name: firstName,
            lastname: lastName
          }
        });*/
        
        
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