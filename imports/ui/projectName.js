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
}

Template.projectName.events({
  'click #continuar': function(event, template) {
    event.preventDefault();
    var name = "";
    var family="";
    if(isNotEmpty($('#project_title').val())){
      name = trimInput($('#project_title').val());

      console.log("hasTopRole="+hasTopRole());
      if(hasTopRole()){
        family="Proyectos";  
      }
      else{
        family="Portafolios";
      }

      console.log(family);

      
      Meteor.call('addProjectName', name, Meteor.userId(), family, function(error, response){
        if(!error){
          FlowRouter.go("/editProject/"+response);
        }
      });
      
    }
    else{
      Bert.alert({message: 'El nombre no puede estar vacío', type: 'error', icon: 'fa fa-times'});
    }
  }
});


