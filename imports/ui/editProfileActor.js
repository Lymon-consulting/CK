import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';
import { catHeights, catAges, catPhysical, catEthnics, catEyes, catHair, catHairType, catLanguages, catCategories } from '/lib/globals.js';
import { getParam } from '/lib/functions.js';

import '/lib/common.js';
import './editProfileActor.html';

function trimInput(val){
  return val.replace(/^\s*|\s*$/g, "");
}

function isNotEmpty(val){
  if(val && val!== ""){
    return true;
  }
}
function formatURL(url){
  if(url!=""){
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;  
    }
  }
  return url;
}

Template.editProfileActor.helpers({
  heights(){
    return catHeights; //variable global en globals.js
  },
  ages(){
    return catAges; //variable global en globals.js
  },
  physical(){
    return catPhysical; //variable global en globals.js
  },
  ethnics(){
    return catEthnics; //variable global en globals.js
  },
  eyes(){
    return catEyes; //variable global en globals.js
  },
  hair(){
    return catHair; //variable global en globals.js
  },
  hairType(){
    return catHairType; //variable global en globals.js
  },
  languages(){
    return catLanguages; //variable global en globals.js
  },
  categories(){
    return catCategories; //variable global en globals.js
  },
  peculiarities(){
    var data = Meteor.user();
    var resume="";
    var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
    if(data!=null && data.cast.peculiarities!=null){
      resume = data.cast.peculiarities;
      $('#max-peculiarities').text(MAX_CHAR_IN_TEXTAREA - resume.length);
    }
    else{
      $('#max-peculiarities').text(MAX_CHAR_IN_TEXTAREA); 
    }
    return resume;
  },
  skills(){
   var data = Meteor.user();
    var resume="";
    var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
    if(data!=null && data.cast.skills!=null){
      resume = data.cast.skills;
      $('#max-skills').text(MAX_CHAR_IN_TEXTAREA - resume.length);
    }
    else{
      $('#max-skills').text(MAX_CHAR_IN_TEXTAREA); 
    }
    return resume;
  },
  video(){
    var video = "";
    if(Meteor.user()){
      if(Meteor.user().cast!=null && Meteor.user().cast.vimeo!=null){
        video = Meteor.user().cast.vimeo;
      }
      else if(Meteor.user().cast!=null && Meteor.user().cast.youtube!=null){
        video = Meteor.user().cast.youtube;
      } 
    }
    return video;
  },
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
  resume(){
    var data = Meteor.user();
    var resume="";
    var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
    if(data!=null && data.cast.resume!=null){
      resume = data.cast.resume;
      $('#max').text(MAX_CHAR_IN_TEXTAREA - resume.length);
    }
    else{
      $('#max').text(MAX_CHAR_IN_TEXTAREA); 
    }
    return resume;
  },
  showName(){
    var name = "";
    if(Meteor.user()){
      Meteor.subscribe("otherUsers");
      if(Meteor.user().cast.showArtisticName){
        name = Meteor.user().cast.artistic;
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
      return Meteor.user().cast.artistic;
    }
  },
  showArtistic(radioVal){
    var result = "";
    Meteor.subscribe("otherUsers");
    var userSelection = Meteor.user().cast.showArtisticName; 
    if(userSelection && radioVal==2){ 
      result = "checked";
    }
    else if(!userSelection && radioVal==1){
      result = "checked";
    }
    return result;
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
  selectedBeard(radioVal){
    var result = "";
    Meteor.subscribe("otherUsers");
    var userSelection = Meteor.user().cast.beard; 
    if(userSelection==='true' && radioVal==='true'){ 
      result = "checked";
    }
    else if(userSelection==='false' && radioVal==='false'){
      result = "checked";
    }
    return result;
  },
  webpage(){
    if(Meteor.user()){
      return Meteor.user().cast.webpage;
    }
  },
  facebook(){
    if(Meteor.user()){
      return Meteor.user().cast.facebook;
    }
  },
  twitter(){
    if(Meteor.user()){
      return Meteor.user().cast.twitter;
    }
  },
  vimeo(){
    if(Meteor.user()){
      return Meteor.user().cast.vimeo;
    }
  },
  youtube(){
    if(Meteor.user()){
      return Meteor.user().cast.youtube;
    }
  },
  instagram(){
    if(Meteor.user()){
      return Meteor.user().cast.instagram;
    }
  },
  imdb(){
    if(Meteor.user()){
      return Meteor.user().cast.imdb;
    }
  },
  /*
  wizard(){
   return Meteor.user().wizard;
  },*/
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
    var country = Meteor.user().cast.country;
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
  heightSelected: function(item){
    var result="";
    var height = Meteor.user().cast.height;
    //console.log(height);
    if(height){
     var elem = height.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  ageSelected: function(item){
    var result="";
    var age = Meteor.user().cast.ageRange;
    //console.log(height);
    if(age){
     var elem = age.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  physicalSelected: function(item){
    var result="";
    var physical = Meteor.user().cast.physical;
    //console.log(height);
    if(physical){
     var elem = physical.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  ethnicsSelected:function(item){
    var result="";
    var ethnics = Meteor.user().cast.ethnicity;
    //console.log(height);
    if(ethnics){
     var elem = ethnics.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  eyesSelected:function(item){
    var result="";
    var eyes = Meteor.user().cast.eyes;
    //console.log(height);
    if(eyes){
     var elem = eyes.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  hairSelected:function(item){
    var result="";
    var hair = Meteor.user().cast.hair;
    //console.log(height);
    if(hair){
     var elem = hair.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  hairTypeSelected:function(item){
    var result="";
    var hairType = Meteor.user().cast.hairType;
    //console.log(height);
    if(hairType){
     var elem = hairType.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  checkLanguage:function(item){
    var result="";
    var language = new Array() ;
    if(Meteor.user() && Meteor.user().cast.languages){
      language = Meteor.user().cast.languages;
      if(language!=null && language.indexOf(item)>=0){
        result = "checked";
      }
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
        result.push(userRoles[i]);
        /*if(userRoles[i]!="Productor" 
          && userRoles[i]!="Director" 
          && userRoles[i]!="Dueño" 
          && userRoles[i]!="Legal" 
          && userRoles[i]!="Ejecutivo"){
          result.push(userRoles[i]);
        }*/
      }
    }
    return result;
  },
  /*
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
  },*/
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
      return cities = City.find({'state': Session.get("selected_state")}).fetch();
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
    if(Meteor.user()!=null && Meteor.user().cast.profilePictureID!=null){
      var profile = Media.findOne({'mediaId':Meteor.user().cast.profilePictureID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_80,h_80,c_thumb,f_auto,r_max/" + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().cast.profilePictureID;    
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
    if(Meteor.user()!=null && Meteor.user().cast!=null && Meteor.user().cast.profileCoverID!=null){
      var profile = Media.findOne({'mediaId':Meteor.user().cast.profileCoverID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().cast.profileCoverID;    
      }

    }
  },
  getGallery(){
    //var data = Meteor.users.findOne({'_id' : Meteor.userId()});
    var array = new Array();
    
    if(Meteor.user()!=null && Meteor.user().cast.gallery){
      for (var i = 0; i < Meteor.user().cast.gallery.length; i++) {
        var obj = {};
        obj.mediaId = Meteor.user().cast.gallery[i];

        if(i==0){
          obj.position = 1;
        }
        else{
          obj.position = 2;
        }
         array.push(obj);
        
      }
    }
    return array;
  },
  isFirstElement(position){
    var result = false;
    if(position===1){
      result = true;
    }
    else{
      result = false;
    }
    return result;
  },
  getPublicID(type){
    if(type==='profile'){
      return Meteor.user().cast.profilePictureID;
    }
    else if(type==='cover'){
      return Meteor.user().cast.profileCoverID;  
    }
  },
  getMedia() {
    Meteor.subscribe("allMedia");
    //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    var media = Media.find({'userId': Meteor.userId()},{sort:{'media_date':-1}});
    return media;
  },
  hasMedia() {
    Meteor.subscribe("allMedia");
    //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    var media = Media.find({'userId': Meteor.userId()}).count();
    var hasMedia = false;
    if(media > 0){
      hasMedia = true;
    }
    return hasMedia;
  },
  getURL(mediaId){
    var url = "";
    var media = Media.findOne({'mediaId':mediaId});
      if(media!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + Meteor.userId() + "/" + media.mediaId;    
      }
    return url;
  },
  showCreateCrewLink(){
    var result = true;
    if(Meteor.user()){
      if(Meteor.user().isCrew!=null && Meteor.user().isCrew){
        result=false;
      }
      /*
      if(Meteor.user().profileType){
        if(Meteor.user().profileType==="crew"){ //si ya es crew ya no mostrar el link
          result = false;
        }
        else if(Meteor.user().profileType==="both"){ //si es tanto cast como crew ya no mostrar el link
          result = false; 
        }
        else{
          result = true;
        }
      }*/
    }
    return result;
  },
  verifyChecked(mediaId){
    var data = Meteor.users.findOne({'_id' : Meteor.userId()});
    var gallery = new Array();
    var result="";
    if(data){
      if(data.cast.gallery){
        gallery = data.cast.gallery;
        for (var i = 0; i < gallery.length; i++) {
          if(mediaId===gallery[i]){
            result="checked";
            break;
          }
        }
      }
      
    }
    return result;
  },
  maxLength(){
    return getParam("MAX_CHAR_IN_TEXTAREA");
  }
});

Template.editProfileActor.events({
  'keyup #resume' : function(event){
    event.preventDefault();
     var len = $('#resume').val().length;
     if(len > getParam("MAX_CHAR_IN_TEXTAREA")){
      val.value= val.value.substring(0,getParam("MAX_CHAR_IN_TEXTAREA"));
    }
    else{
      $('#max').text(getParam("MAX_CHAR_IN_TEXTAREA")-len);
    }
  },
  'keyup #peculiarities' : function(event){
     event.preventDefault();
     var len = $('#peculiarities').val().length;
     if(len > getParam("MAX_CHAR_IN_TEXTAREA")){
      val.value= val.value.substring(0,getParam("MAX_CHAR_IN_TEXTAREA"));
    }
    else{
      $('#max-peculiarities').text(getParam("MAX_CHAR_IN_TEXTAREA")-len);
    }
  },
  'keyup #skills' : function(event){
     event.preventDefault();
     var len = $('#skills').val().length;
     if(len > getParam("MAX_CHAR_IN_TEXTAREA")){
      val.value= val.value.substring(0,getParam("MAX_CHAR_IN_TEXTAREA"));
    }
    else{
      $('#max-skills').text(getParam("MAX_CHAR_IN_TEXTAREA")-len);
    }
  },
  'change #personName': function(event,template){
    var name = trimInput(event.target.value);
    console.log("Actualizando profile.name"+ " con "+ name + " para "+Meteor.userId());
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
    //console.log(personLastName2);
    Meteor.call('updateLastName2', Meteor.userId(), personLastName2);
    var name = trimInput($('#personName').val());
    var lastname = trimInput($('#personLastName').val());
    var fullname = name + " " + lastname + " " + personLastName2;
    Meteor.call('updateFullName', Meteor.userId(), fullname);
  },
  'change #artisticName': function(event,template){
    var artisticName = trimInput(event.target.value);
    //console.log(artisticName);
    Meteor.call('updateCastArtisticName', Meteor.userId(), artisticName);
  },
  'change .radio' : function(event, template){
    event.preventDefault();
    var inputValue = $(event.target).attr("data-answer");
    if(inputValue==="artistic"){
      Meteor.call('updateCastPreferedName', Meteor.userId(), true); 
    }
    else{
      Meteor.call('updateCastPreferedName', Meteor.userId(), false); 
    }
  },
  'change .sex' : function(event, template){
    event.preventDefault();
    var inputValue = $(event.target).attr("data-answer");
    //console.log(inputValue);
    Meteor.call('updateCastGender', Meteor.userId(), inputValue); 
  },
  'change .facial-hair' : function(event, template){
    event.preventDefault();
    var inputValue = $(event.target).attr("data-answer");
    //console.log(inputValue);
    Meteor.call('updateCastBeard', Meteor.userId(), inputValue); 
  },
  'change #country': function(event,template){
    var country = trimInput(event.target.value);
    Meteor.call('updateCountry', Meteor.userId(), country);
    Session.set("selected_country", event.target.value);
  },
  'change #states': function(event,template){
    var state = trimInput(event.target.value);
    Meteor.call('updateState', Meteor.userId(), state);
    Meteor.call('updateCountry', Meteor.userId(), "México");
    Session.set("selected_state", state);
    var firstCity = City.findOne({'state': state}).city;
    Meteor.call('updateCity', Meteor.userId(), firstCity);  
  },
  'change #city': function(event,template){
    var city = trimInput(event.target.value);
    Meteor.call('updateCity', Meteor.userId(), city);
    Meteor.call('updateCountry', Meteor.userId(), "México");
  },
  'change #height': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastHeight', Meteor.userId(), value);
  },
  'change #age': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastAge', Meteor.userId(), value);
  },
  'change #physical': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastPhysical', Meteor.userId(), value);
  },
  'change #ethnics': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastEthnicity', Meteor.userId(), value);
  },
  'change #eyes': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastEyes', Meteor.userId(), value);
  },
  'change #hair': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastHair', Meteor.userId(), value);
  },
  'change #hairType': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastTypeOfHair', Meteor.userId(), value);
  },
  'change #language': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastLanguage', Meteor.userId(), value);
  },
  'change #resume': function(event,template){
    var resume = trimInput(event.target.value);
    Meteor.call('updateCastResume', Meteor.userId(), resume);
  },
  'change #peculiarities': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastPeculiarities', Meteor.userId(), value);
  },
  'change #skills': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastSkills', Meteor.userId(), value);
  },
  'change #video': function(event,template){
    event.preventDefault();
    var video = trimInput(event.target.value);
    if(isNotEmpty(video)){
      if(video.indexOf("vimeo")>0){
        Meteor.call('updateCastVimeoPage', Meteor.userId(), formatURL(video)); 
        Meteor.call('updateCastYoutubePage', Meteor.userId(), null); 
      } 
      else if(video.indexOf("youtube")>0){
        Meteor.call('updateCastYoutubePage', Meteor.userId(), formatURL(video)); 
        Meteor.call('updateCastVimeoPage', Meteor.userId(), null); 
      }
      else{
        Bert.alert({message: 'Por el momento únicamente aceptamos videos de vimeo o youtube', type: 'danger', icon: 'fa fa-exclamation'});
      }
      
    }
    else{
      Meteor.call('updateCastYoutubePage', Meteor.userId(), null); 
      Meteor.call('updateCastVimeoPage', Meteor.userId(), null); 
    }
  },
  'change #facebook_page': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastFacebookPage', Meteor.userId(), value);
  },
  'change #imdb_page': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastImdbPage', Meteor.userId(), value);
  },
  'change #twitter_page': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastTwitterPage', Meteor.userId(), value);
  },
  'change #instagram_page': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastInstagramPage', Meteor.userId(), value);
  },
  'change #web_page': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastWebPage', Meteor.userId(), value);
  },
  'click #openMediaGallery': function(event,template){
    event.preventDefault();
    $(".media-thumb").css('border','none');
    $("#setProfilePicture").addClass('disabled');
    $('#modal1').modal('show');
  },
  'click #openMediaCover': function(event,template){
    event.preventDefault();
    $(".media-thumb").css('border','none');
    $("#setCoverPicture").addClass('disabled');
    $('#modal2').modal('show');
  },
  'click #selectProfilePicture': function(event,template){
    event.preventDefault();
    var mediaId = $(event.currentTarget).attr("data-id");

    Session.set("mediaId",mediaId);

   $(".media-thumb").css('border','none');
   $(event.target).css('border', "solid 3px #ED1567");
   $("#setProfilePicture").removeClass('disabled');

  },
  'click #setProfilePicture': function(event,template){
   event.preventDefault();
   var mediaId = Session.get("mediaId");

   Meteor.call(
    'updateCastProfilePicture',
    Meteor.userId(),
    mediaId
    );

    $('#modal1').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();

  },
  'click #selectCoverPicture': function(event,template){
   event.preventDefault();
    var mediaId = $(event.currentTarget).attr("data-id");

    Session.set("mediaId",mediaId);

   $(".media-thumb").css('border','none');
   $(event.target).css('border', "solid 3px #ED1567");
   $("#setCoverPicture").removeClass('disabled');

  },
  'click #setCoverPicture': function(event,template){
   event.preventDefault();
   var mediaId = Session.get("mediaId");

   Meteor.call(
    'updateCastCoverPicture',
    Meteor.userId(),
    mediaId
    );

    $('#modal2').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();

  },
  'click .goMediaLibraryProfile': function(event,template){
    event.preventDefault();
    $('#modal2').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    //Session.set("from","cast");
    FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/cast/"+Meteor.userId()+"/profile");
  },
  'click .goMediaLibraryCover': function(event,template){
    event.preventDefault();
    $('#modal2').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    //Session.set("from","cast");
    FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/cast/"+Meteor.userId()+"/cover");
  },
  'click .goMediaLibraryGallery': function(event,template){
    event.preventDefault();
    $('#modal3').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    //Session.set("from","cast");
    FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/cast/"+Meteor.userId()+"/gallery_cast");
  },
  'click #goProfile': function(event,template){
    FlowRouter.go("/profilePageActor/"+Meteor.userId());
  },
  'change .language': function(event, template){
    //console.log($(event.target).val() + " - " + event.target.checked);

    if(event.target.checked){
      Meteor.call('addCastLanguage', Meteor.userId(), $(event.target).val());
    }
    else{
      Meteor.call('removeCastLanguage', Meteor.userId(), $(event.target).val()); 
    }
  },
  'change .category': function(event, template){
    //console.log($(event.target).val() + " - " + event.target.checked);

    if(event.target.checked){
      Meteor.call('addCastCategory', Meteor.userId(), $(event.target).val());
    }
    else{
      Meteor.call('removeCastCategory', Meteor.userId(), $(event.target).val()); 
    }
  },
  /*
  'click #goToMedia': function(event,template){
    event.preventDefault();
    FlowRouter.go("/mediaEditor/"+Meteor.userId());
  },*/
  'click #addCrewProfile':function(event, template){
      event.preventDefault();

      //Meteor.call('updateProfileType', Meteor.userId(),"both");
      Meteor.call('setIsCrew', Meteor.userId(),true);

      $('#crewModal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      //Session.set("viewAs","crew");
      window.scrollTo(0, 0);
      FlowRouter.go("/editProfile/" + Meteor.userId());
    },
    'change .check':function(event,template){
      event.preventDefault();
      var mediaId = $(event.currentTarget).attr("data-id");
      //console.log(mediaId);
      if(event.target.checked){
        Meteor.call('addGalleryCast', Meteor.userId(), mediaId);
      }
      else{
        Meteor.call('removeGalleryCast', Meteor.userId(), mediaId); 
      }
    },
});