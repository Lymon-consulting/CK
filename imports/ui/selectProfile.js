import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './selectProfile.html';

Template.selectProfile.rendered = function(){
  /*
    Validación para que no pueda regresarse a esta página si ya eligió Crew o Cast
    Lleva un timer porque el objeto Meteor.user() es asíncrono y no está disponible inmediatamente
  */
  Meteor.setTimeout(function(){
    var user = Meteor.user();
    console.log(user);
    if(user){
      if(user.isCrew || user.isCast){
        console.log("Ya pasó por aquí y se va a ir a otra página");
        if(user.isCrew){
          FlowRouter.go("/editProfile/"+Meteor.userId());  
        }
        else if(user.isCast){
          FlowRouter.go("/editProfileActor/"+Meteor.userId());  
        }
        
      }
    }
  }, 1000);  
}

Template.selectProfile.events({
  'click .setProfile': function(event, template){
    event.preventDefault();
    var optionSelected = $(event.target).attr("data-answer");
    if(optionSelected==='crew'){
      //Meteor.call('updateProfileType', Meteor.userId(), 'crew'); 
      Meteor.call('setIsCrew', Meteor.userId(), true); 
      FlowRouter.go('/confirmProfile/crew' + Meteor.userId());  
    }
    else if(optionSelected==='industry'){
      //Meteor.call('updateProfileType', Meteor.userId(), 'crew'); 
      Meteor.call('setIsCast', Meteor.userId(), true); 
      FlowRouter.go('/confirmProfile/industry' + Meteor.userId());  
    }
    else if(optionSelected==='cast'){
      //Meteor.call('updateProfileType', Meteor.userId(), 'cast'); 
      Meteor.call('setIsCast', Meteor.userId(), true); 
      //FlowRouter.go('/editProfileActor/' + Meteor.userId());  
      FlowRouter.go('/confirmProfile/cast' + Meteor.userId()); 
    }

  }
});