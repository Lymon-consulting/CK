import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';

import './editProfileActor.html';
import '/lib/common.js';

function trimInput(val){
  return val.replace(/^\s*|\s*$/g, "");
}

function isNotEmpty(val){
  if(val && val!== ""){
    return true;
  }
}

Template.editProfileActor.helpers({
  userId() {
    return Meteor.userId();
  },
  name(){
   if(Meteor.user()){
      return Meteor.user().profile.name;
    }
  },
  lastname(){
    if(Meteor.user()){
      return Meteor.user().profile.lastname;
    }
  },
  lastname2(){
    if(Meteor.user()){
      return Meteor.user().profile.lastname2;
    }
  },
  showName(){
    var name = "";
    if(Meteor.user()){
      Meteor.subscribe("otherUsers");
      if(Meteor.user().showArtisticName){
        name = Meteor.user().artistic;
      }
      else{
        name = Meteor.user().fullname;
      }
    } 
    return name;
  },
  artistic(){
    if(Meteor.user()){
      Meteor.subscribe("otherUsers");
      return Meteor.user().artistic;
    }
  },
  showArtistic(radioVal){
    var result = "";
    Meteor.subscribe("otherUsers");
    var userSelection = Meteor.user().showArtisticName; 
    if(userSelection && radioVal==2){ 
      result = "checked";
    }
    else if(!userSelection && radioVal==1){
      result = "checked";
    }
    return result;
  },
  resume(){
    if(Meteor.user()){
      return Meteor.user().resume;
    }
  },
  resumeCount(){
    if(Meteor.user()){
      var rest = Meteor.user().resume;
      var result = 0;
      if(rest!=null && rest.length!=null){
        result = (450 - rest.length);
      }
      return result;
    }
  },
  webpage(){
    if(Meteor.user()){
      return Meteor.user().webpage;
    }
  },
  facebook(){
    if(Meteor.user()){
      return Meteor.user().facebook;
    }
  },
  twitter(){
    if(Meteor.user()){
      return Meteor.user().twitter;
    }
  },
  vimeo(){
    if(Meteor.user()){
      return Meteor.user().vimeo;
    }
  },
  youtube(){
    if(Meteor.user()){
      return Meteor.user().youtube;
    }
  },
  instagram(){
    if(Meteor.user()){
      return Meteor.user().instagram;
    }
  },
  wizard(){
   return Meteor.user().wizard;
  },
  roleSelected: function(value){
    var result="";
    var prole = Meteor.user().role;
    if(prole){
     var elem = prole.indexOf(value);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  citySelected: function(value){
    var result="";
    var city = Meteor.user().city;
    if(city){
     var elem = city.indexOf(value);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  stateSelected: function(value){
    var result="";
    var state = Meteor.user().state;
    if(state){
     var elem = state.indexOf(value);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  countrySelected: function(value){
    var result="";
    var country = Meteor.user().country;
    if(country){
     var elem = country.indexOf(value);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  getCategories(){
   var data = Ocupation.find({},{sort:{'title':1}}).fetch();
   return _.uniq(data, false, function(transaction) {return transaction.title});
  },
  getOcupationsFromCategory(){
    if(Session.get("selected_category")!=null){
      return Ocupation.find({'title': Session.get("selected_category")}).fetch();
    }
    else{
      return Ocupation.find({'title': "Animacion y arte digital"}).fetch();
    }
  },
  getRolesSelected(){
    var result = new Array();
    var userRoles = Meteor.user().role;
    if(userRoles){
      for (var i = 0; i < userRoles.length; i++) {
        if(userRoles[i]!="Productor" 
          && userRoles[i]!="Director" 
          && userRoles[i]!="Dueño" 
          && userRoles[i]!="Legal" 
          && userRoles[i]!="Ejecutivo"){
          result.push(userRoles[i]);
        }
      }
    }
    return result;
  },
  hasPrimaryRole(){
    var result = false;
    if(Meteor.user().role){
      result = true;
    }
    return result;
  },
  getPrimaryRoles(){
    var result = new Array();
    var userRoles = Meteor.user().role;
    var strResult = "";
    if(userRoles){
      for (var i = 0; i < userRoles.length; i++) {
        if(userRoles[i]==="Productor"){
          result.push(userRoles[i]);
        }
        else if(userRoles[i]==="Director"){
          result.push(userRoles[i]);
        }
        else if(userRoles[i]==="Dueño"){
          result.push(userRoles[i]);
        }
        else if(userRoles[i]==="Legal"){
          result.push("Representante legal");
        }
        else if(userRoles[i]==="Ejecutivo"){
          result.push("Administrador de industria");
        }
      }

      for (var i = 0; i < result.length; i++) {
        strResult = strResult + ", " + result[i];
      }
      strResult = strResult.substring(2, strResult.length);
    }
        //console.log(result);
    return strResult;
  },
  getCountries(){
    var data = City.find().fetch();
    return _.uniq(data, false, function(transaction) {return transaction.country});
  },
  getStatesFromCountries(){
    var country;
    if(Session.get("selected_country")!=null){
      country = City.find({'country': Session.get("selected_country")}).fetch();
      return _.uniq(country, false, function(transaction) {return transaction.state});
    }
    else{
     country = City.find({'country': 'México'}).fetch(); 
     return _.uniq(country, false, function(transaction) {return transaction.state});
   }
  },
  getCitiesFromStates(){
    if(Session.get("selected_state")!=null){
      return City.find({'state': Session.get("selected_state")}).fetch();
    }
    else{
      if(Meteor.user().state){
        return City.find({'state': Meteor.user().state}).fetch();    
      }
      else{
        return City.find({'state': 'Aguascalientes'}).fetch();    
      }
    }
  },
  getProfilePicture() {
    if(Meteor.user().profilePictureID!=null){
      var profile = Media.findOne({'mediaId':Meteor.user().profilePictureID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_80,h_80,c_thumb,f_auto,r_max/" + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().profilePictureID;    
      }

    }
  },
  getInitials(){
    var name = Meteor.user().profile.name;
    var lastname = Meteor.user().profile.lastname;
    var initials = name.charAt(0) + lastname.charAt(0);
    return initials;
  },
  getCoverPicture() {
    if(Meteor.user().profileCoverID!=null){
      var profile = Media.findOne({'mediaId':Meteor.user().profileCoverID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().profileCoverID;    
      }

    }
  },
  getPublicID(type){
    if(type==='profile'){
      return Meteor.user().profilePictureID;
    }
    else if(type==='cover'){
      return Meteor.user().profileCoverID;  
    }
  },
  getMedia(type) {
    Meteor.subscribe("allMedia");
    var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    return media;
  },
  getURL(mediaId){
    var url = "";
    url = Meteor.settings.public.CLOUDINARY_RES_URL + "/" + mediaId;
    return url;
  }
});

Template.editProfileActor.events({
  'change #personName': function(event,template){
    var name = trimInput(event.target.value);
    console.log(name);
    if(isNotEmpty(name)){
      Meteor.call('updateName', Meteor.userId(), name);
      var lastname = trimInput($('#personLastName').val());
      var lastname2 = trimInput($('#personLastName2').val());
      var fullname = name + " " + lastname + " " + lastname2;
      Meteor.call('updateFullName', Meteor.userId(), fullname);
    }
  },
  'change #personLastName': function(event,template){
    var personLastName = trimInput(event.target.value);
    console.log(personLastName);
    if(isNotEmpty(personLastName)){
      Meteor.call('updateLastName', Meteor.userId(), personLastName);
      var name = trimInput($('#personName').val());
      var lastname2 = trimInput($('#personLastName2').val());
      var fullname = name + " " + personLastName + " " + lastname2;
      Meteor.call('updateFullName', Meteor.userId(), fullname);
    }
  },
  'change #personLastName2': function(event,template){
    var personLastName2 = trimInput(event.target.value);
    console.log(personLastName2);
    Meteor.call('updateLastName2', Meteor.userId(), personLastName2);
    var name = trimInput($('#personName').val());
    var lastname = trimInput($('#personLastName').val());
    var fullname = name + " " + lastname + " " + personLastName2;
    Meteor.call('updateFullName', Meteor.userId(), fullname);
  },
  'change #artisticName': function(event,template){
    var artisticName = trimInput(event.target.value);
    console.log(artisticName);
    Meteor.call('updateArtisticName', Meteor.userId(), artisticName);
  },
  'change .radio' : function(event, template){
    event.preventDefault();
    var inputValue = $(event.target).attr("data-answer");
    console.log(inputValue);
    if(inputValue==="artistic"){
      Meteor.call('updatePreferedName', Meteor.userId(), true);  
    }
    else{
      Meteor.call('updatePreferedName', Meteor.userId(), false); 
    }
  },
  'change .sex' : function(event, template){
    event.preventDefault();
    var inputValue = $(event.target).attr("data-answer");
    console.log(inputValue);
    Meteor.call('updateGender', Meteor.userId(), inputValue); 
  }
});