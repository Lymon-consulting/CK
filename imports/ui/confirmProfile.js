import { Template } from 'meteor/templating';

import './confirmProfile.html';

var check1 = false;
var check2 = false;
var check3 = false;
var check4 = false;
var check5 = false;


validateAllChecks = function(){
  if(!check1 && !check2 && !check3 && !check4 && !check5 ){
    
    $("#continuar").html("Ninguno de los anteriores"); 
  }
  else{
    $("#continuar").html("Continuar");
  }
}


Template.confirmProfile.helpers({
  typeIsCrew(){
    if(FlowRouter.getParam("type")==="crew"){
      return true;
    }
    else{
      return false;
    }
  }
});

Template.confirmProfile.events({
  'change .profile'(event, instance) {
    //console.log(event.target.id + " - " + event.target.checked);
    if(event.target.id==="check1"){
      if(event.target.checked){
        check1 = true;
      }
      else{
        check1 = false;
      }
    }
    if(event.target.id==="check2"){
      if(event.target.checked){
        check2 = true;
      }
      else{
        check2 = false;
      }
    }
    if(event.target.id==="check3"){
      if(event.target.checked){
        check3 = true;
      }
      else{
        check3 = false;
      }
    }
    if(event.target.id==="check4"){
      if(event.target.checked){
        check4 = true;
      }
      else{
        check4 = false;
      }
    }
    if(event.target.id==="check5"){
      if(event.target.checked){
        check5 = true;
        
      }
      else{
        check5 = false;
      }
    }
    validateAllChecks();
  },
  'click #continuar': function(event, template){
    event.preventDefault();
    if (check1) { 
        console.log("check1"); 
        Meteor.call('addTopRole', Meteor.userId(),"1"); //1=Productor
    }
    if (check2) { 
        console.log("check2"); 
        Meteor.call('addTopRole', Meteor.userId(),"2"); //2=Director
    }
    if (check3) { 
        console.log("check3"); 
        Meteor.call('addTopRole', Meteor.userId(),"3"); //3=Dueño
    }
    if (check4) { 
        console.log("check4"); 
        Meteor.call('addTopRole', Meteor.userId(),"4"); //4=Representante
    }
//    console.log(FlowRouter.getParam("type"));
    if(FlowRouter.getParam("type")==="crew"){
      FlowRouter.go('/editProfile/' + Meteor.userId());
    }
    else if(FlowRouter.getParam("type")==="cast"){
      FlowRouter.go('/editProfileActor/' + Meteor.userId());
    }
  }
});