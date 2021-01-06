import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';
import { trimInput } from '/lib/functions.js';
import { isNotEmpty } from '/lib/functions.js';
import { hasTopRole } from '/lib/functions.js';

import './projectName.html';
import '/lib/common.js';

var fam_value;

Template.projectName.rendered = function(){
  this.autorun(function(){
    Session.set("showOficial",null);
  });
}

/*
var hasTopRole=function(){
  var array = new Array();
  var result = false;
  if(Meteor.user()!=null && Meteor.user().role!=null){
    array = Meteor.user().role;
    for (var i = array.length - 1; i >= 0; i--) {
      if(array[i]==="Director"){
        result = true;  
        break;
      }
      if(array[i]==="Productor"){
        result = true;  
        break;
      }
      if(array[i]==="Dueño"){
        result = true;  
        break;
      }
      if(array[i]==="Legal"){
        result = true;  
        break;
      }

    }
  }
  return result;
}*/

Template.projectName.helpers({
  isProduction(){
    return Session.get("showOficial");
  }
});

Template.projectName.events({
  'click #continuar': function(event, template) {
    event.preventDefault();
    var name = "";
    var family="";
    var isOficial = false;

    if ($('#oficial_project').is(":checked")){
      isOficial = true;
    }
    else{
      isOficial = false;
    }

    if(isNotEmpty($('#project_title').val())){
      name = trimInput($('#project_title').val());

      if(fam_value!=null && fam_value!=""){
        family = fam_value;  

        Meteor.call('addProjectName', name, Meteor.userId(), family, function(error, response){
          if(!error){
            Meteor.call(
              'setOficial',
              FlowRouter.getParam('id'),
              isOficial 
            );
            
            FlowRouter.go("/editProject/"+response);
          }
        });

      }
    }
    else{
      Bert.alert({message: 'El nombre no puede estar vacío', type: 'error', icon: 'fa fa-times'});
    }
  },
  'change .family' : function(event, template){
    event.preventDefault();
    var inputValue = $(event.target).attr("data-answer");
    fam_value = inputValue;
    if(fam_value==="P"){
      Session.set("showOficial",true);
    }
    else{
      Session.set("showOficial",false); 
    }
    $('#project_title').prop('disabled', false);
    $('#continuar').prop('disabled', false);
  },
});


