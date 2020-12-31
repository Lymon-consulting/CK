import { Template } from 'meteor/templating';
import { catHeights, catAges, catPhysical, catEthnics, catEyes, catHair, catHairType, catLanguages, catCategories } from '/lib/globals.js';

import '/lib/common.js';
import './editProfileCast.html';

Template.editProfileCast.helpers({
  categories(){
    return catCategories; //variable global en globals.js
  },
  selectedGender(radioVal){
    var result = "";
    Meteor.subscribe("otherUsers");
    var userSelection = Meteor.user().cast.sex; 
    if(userSelection==='Masculino' && radioVal==='Masculino'){ 
      result = "checked";
    }
    else if(userSelection==='Femenino' && radioVal==='Femenino'){
      result = "checked";
    }
    else if(userSelection==='Sin definir' && radioVal==='Sin definir'){
      result = "checked";
    }
    return result;
  },
  checkCategory:function(item){
    var result="";
    var category = new Array() ;
    if(Meteor.user() && Meteor.user().cast.categories){
      category = Meteor.user().cast.categories;
      if(category!=null && category.indexOf(item)>=0){
        result = "checked";
      }
    }
   return result;
  },
});

Template.editProfileCast.events({

});