import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';

import './projectName.html';
import '/lib/common.js';

var trimInput= function(val){
  if(val!=null && val!=""){
    return val.replace(/^\s*|\s*$/g, "");  
  }
  return false;
}

var isNotEmpty=function(val){
  if(val && val!== ""){
    return true;
  }
  else{
    Bert.alert({message: 'Por favor completa todos los campos obligatorios', type: 'danger', icon: 'fa fa-exclamation'});
    return false;    
  }
}

Template.projectName.events({
  'click #continuar': function(event, template) {
    event.preventDefault();
    var name = "";
    if(isNotEmpty($('#project_title').val())){
      name = trimInput($('#project_title').val());
      Meteor.call('addProjectName', name, Meteor.userId(), function(error, response){
        if(!error){
          FlowRouter.go("/editProject/"+response);
        }
      });
      
    }
    else{
      Bert.alert({message: 'El nombre de la empresa u organización no puede estar vacío', type: 'error', icon: 'fa fa-times'});
    }
  }
});


