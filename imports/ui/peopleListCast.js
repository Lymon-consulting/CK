import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';
import { UsersIndex } from '/lib/common.js';
import { ProjectIndex } from '/lib/common.js';
import { IndustryIndex } from '/lib/common.js';
import { getParam } from '/lib/functions.js';
import { catHeights, catAges, catPhysical, catEthnics, catEyes, catHair, catHairType, catLanguages, catCategories } from '/lib/globals.js';

import './peopleListCast.html';
import '/lib/common.js';


Meteor.subscribe("otherUsers");

Template.peopleListCast.rendered = function(){
  UsersIndex.getComponentMethods().addProps('isCast', true);
  ProjectIndex.getComponentMethods().removeProps(); 
  IndustryIndex.getComponentMethods().removeProps();
}

Template.peopleListCast.helpers({
   usersIndex: () => UsersIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
         placeholder: 'Buscar', 
         id: 'searchBox'
      }; 
   },
   searchCount: () => {
    // index instanceof EasySearch.index
    let dict = UsersIndex.getComponentDict(/* optional name */);

    // get the total count of search results, useful when displaying additional information
    return dict.get('count')
   },
   projectIndex: () => ProjectIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
       placeholder: 'Buscar', 
       id: 'searchBox'
     }; 
   },
   searchCount: () => {
    // index instanceof EasySearch.index
    let dict = ProjectIndex.getComponentDict(/* optional name */);

    // get the total count of search results, useful when displaying additional information
    return dict.get('count')
  },
  industryIndex: () => IndustryIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
       placeholder: 'Buscar', 
       id: 'searchBox'
     }; 
   },
   searchCount: () => {
    // index instanceof EasySearch.index
    let dict = IndustryIndex.getComponentDict(/* optional name */);

    // get the total count of search results, useful when displaying additional information
    return dict.get('count')
  },
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
    getName(userId){
      var result="";
      var user = Meteor.users.findOne({'_id': userId});
      if(user!=null){
        if(user.cast!=null && user.cast.showArtisticName){
          result = user.cast.artistic;
        }
        else{
          result = user.fullname;
        }
      }
      return result;
    },
    getCategories(userId){
      var strResult = "";
      var user = Meteor.users.findOne({'_id': userId});
      var result = new Array();
      if(user!=null && user.cast!=null && user.cast.categories){
         result = user.cast.categories;
         for (var i = 0; i < result.length; i++) {
           strResult = strResult + ", " + result[i];
         }
         strResult = strResult.substring(2,strResult.length);
      }
      return strResult;
   },
   getAllOcupations(){
      return Ocupation.find({},{sort:{"secondary":1}}).fetch();
   },
   getAvailableYears(){
     var years = new Array();
    var MIN_YEAR = getParam("MIN_YEAR");
    var MAX_YEAR = getParam("MAX_YEAR");
    for(i=MAX_YEAR; i>MIN_YEAR; i--){
      years.push(i);
    }
    return years;
  },
  getCountries(){
    var data = City.find().fetch();
    return _.uniq(data, false, function(transaction) {return transaction.country});
  },
  getStatesFromCountries(){
    var country;
    if(Session.get("selected_country")!=null){
      country = City.find({'country': Session.get("selected_country")}).fetch();
      return _.uniq(country, false, function(transaction) {
        if(transaction.state){
          return transaction.state
        }
      });
    }
    else{
     country = City.find({'country': 'México'}).fetch(); 
     return _.uniq(country, false, function(transaction) {
        if(transaction.state){
          return transaction.state
        }
     });
   }
  },
  getCitiesFromStates(){
    if(Session.get("selected_state")!=null){
      return cities = City.find({'state': Session.get("selected_state")}).fetch();
    }
    else{
      if(Meteor.user() && Meteor.user().state){
        return City.find({'state': Meteor.user().state}).fetch();    
      }
      else{
        return City.find({'state': 'Aguascalientes'}).fetch();    
      }
    }
  },
   profilePicture(userId){
      return Images.find({'owner': userId});
   },
   notSameUser(userId){
      val = true;
      if(userId=== Meteor.userId()){
         val = false;
      }
      return val;
   },
   getPrimaryRoles(roles){
      var result = new Array();
      var strResult = "";
      userRoles = roles;
      for (var i = 0; i < userRoles.length; i++) {
        result.push(userRoles[i]);
        /*
        if(userRoles[i]==="Productor"){
          result.push(userRoles[i]);
        }
        else if(userRoles[i]==="Director"){
          result.push(userRoles[i]);
        }
        else if(userRoles[i]==="Dueño"){
          //result.push(userRoles[i]);
        }
        else if(userRoles[i]==="Legal"){
          //result.push("Representante legal");
        }
        else if(userRoles[i]==="Ejecutivo"){
          //result.push("Administrador de industria");
        }
        else{
          result.push(userRoles[i]);
        }*/
      }

      for (var i = 0; i < result.length; i++) {
        strResult = strResult + ", " + result[i];
      }
      strResult = strResult.substring(2, strResult.length);

      return strResult;

   },
/*   personalCover(userId){
      Meteor.subscribe("personalcover");
      return PersonalCover.find({'owner': userId});
   },*/
   showButtonFollow(follow){
      var following = Meteor.users.find({$and : [ {'_id' : Meteor.userId()} , {"follows": follow }]});

      var found = true;
      if(following.count() > 0){
         found = false;
      }
      return found;
   },
   getRoleSelected: function(value){
      var prole = "";
      if(Session.get("role_selected")!=null){
        prole = Session.get("role_selected");
      }
      else{
        prole = "cualquier";
      }
      return (prole === value) ? 'selected' : '' ;
    },
    getLocationSelected: function(value){
      var plocation = "";
      if(Session.get("location_selected")!=null){
        plocation = Session.get("location_selected");
      }
      else{
        plocation = "cualquier";
      }
      return (plocation === value) ? 'selected' : '' ;
    },
    getProfilePicture(userId) {
      Meteor.subscribe("allMedia");
      var user = Meteor.users.findOne({'_id':userId});
      if(user!=null && user.cast!=null && user.cast.profilePictureID!=null){
        var profile = Media.findOne({'mediaId':user.cast.profilePictureID});
        if(profile!=null){
          return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_80,h_80,c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.cast.profilePictureID;    
        }
        
      }
      /*
       var url = "";
       var user = Meteor.users.findOne({'_id':userId});
       if(user.profilePictureID!=null && user.profilePictureID!=""){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_100,h_100,c_thumb,r_max/" + user.profilePictureID;
       }
       return url;*/
    },
    getInitials(userId){
      var name = "";
      var lastname = "";
      var initials = "";      
      var user = Meteor.users.findOne({'_id':userId});
      if(user){
        name = user.profile.name;
        lastname = user.profile.lastname;
        initials = name.charAt(0) + lastname.charAt(0);  
      }
      return initials;
    },
    getCoverPicture(userId, size) {
      Meteor.subscribe("allMedia");
      var user = Meteor.users.findOne({'_id':userId});
      var url;
      if(user!=null && user.cast!=null && user.cast.profileCoverID!=null){
        var cover = Media.findOne({'mediaId':user.cast.profileCoverID});
        if(cover!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_scale" + "/v" + cover.media_version + "/" + userId + "/" + user.cast.profileCoverID;    
        }
        
      }
      //console.log(url);
      return url;
      /*
       Meteor.subscribe("otherUsers");
       var url = "";
       var user = Meteor.users.findOne({'_id':userId});
       if(user.profileCoverID!=null && user.profileCoverID!="undefined"){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_scale/" + user.profileCoverID;
       }
       return url;*/
    }

   
});

Template.peopleListCast.events({
   'click #pushFollow': function(event, template) {
      event.preventDefault();

      
      
      //var user = $("#thisUser").val();
      var user = $(event.target).attr("data-id");
      console.log("Intentando seguir a "+ user);
      Meteor.users.update(
         {'_id': Meteor.userId()},
         { $push: { 'follows': user } }
      );

      $("#pushFollow").attr("disabled", true);
   },
  'click .pushCollaborator': function(event, template) {
      event.preventDefault();
      var user = event.target.id;
      Session.set("collaborator",user);
      FlowRouter.go('/addCollaborator');
   },
   'click #buscarBtn': function(event, template) {
      //event.preventDefault();
      console.log("Si entra");
      var e = jQuery.Event("keyup");
      e.keyCode = $.ui.keyCode.ENTER;
      $("#searchBox").trigger(e);

   },
   'change #location': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('city', $(e.target).val());
         Session.set("location_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('city');  
         Session.set("role_selected",null);
      }
  },
  'change #role': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('role', $(e.target).val());
         Session.set("role_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('role');  
         Session.set("role_selected",null);
      }
  },
  'change .category': function (event) {

      var modelo = $("#modelo").prop("checked");
      var actor = $("#actor").prop("checked");
      var bailarin = $("#bailarin").prop("checked");
      var cantante = $("#cantante").prop("checked");
      var extra = $("#extra").prop("checked");
      var doble = $("#doble").prop("checked");
      if(modelo && actor && bailarin && cantante && extra && doble){ //Todos seleccionados
        UsersIndex.getComponentMethods().removeProps('cast.categories');  
        Session.set("category_selected",null);
      }
      else if(!modelo && !actor && !bailarin && !cantante && !extra && !doble){ //Ninguno seleccionados
        UsersIndex.getComponentMethods().removeProps('cast.categories');  
        Session.set("category_selected",null);
      }
      else{
        UsersIndex.getComponentMethods().addProps('cast.categories', $(event.target).val());
        Session.set("category_selected",$(event.target).val());
      }

      /*
      if(event.target.checked){
        UsersIndex.getComponentMethods().addProps('categories', $(event.target).val());
        Session.set("category_selected",$(event.target).val());
      }
      else{
        UsersIndex.getComponentMethods().removeProps('categories');  
        Session.set("category_selected",null);
      }*/
  },
  'change .gender': function (event) {
      /*
      console.log($("#f-check").prop("checked"));
      console.log($("#m-check").prop("checked"));*/

      var male = $("#m-check").prop("checked");
      var female = $("#f-check").prop("checked")

      if(male && female){ //Ambos tienen el check, buscar todos
        UsersIndex.getComponentMethods().removeProps('cast.sex');
        Session.set("gender_selected",null);
      }
      else if(!male && !female){ //Ninguno tiene el check, buscar todos
        UsersIndex.getComponentMethods().removeProps('cast.sex');
        Session.set("gender_selected",null);
      }
      else if(male && !female){ //Masculino tiene el ckeck y femenino no
        UsersIndex.getComponentMethods().addProps('cast.sex', $("#m-check").val());
        Session.set("gender_selected",$("#m-check").val());
      }
      else if(!male && female){ //Femenino tiene el ckeck y masculino no
        UsersIndex.getComponentMethods().addProps('cast.sex', $("#f-check").val());
        Session.set("gender_selected",$("#f-check").val());
      }

      /*
      if(event.target.checked){
        UsersIndex.getComponentMethods().addProps('sex', $(event.target).val());
        Session.set("gender_selected",$(event.target).val());
      }
      else{
        UsersIndex.getComponentMethods().removeProps('sex');  
        Session.set("gender_selected",null);
      }*/
  },
  'change #eyes': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('eyes', $(e.target).val());
         Session.set("eyes_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('eyes');  
         Session.set("eyes_selected",null);
      }
  },
  'change #hair': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('hair', $(e.target).val());
         Session.set("hair_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('hair');  
         Session.set("hair_selected",null);
      }
  },
  'change #hairType': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('hairType', $(e.target).val());
         Session.set("hairType_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('hairType');  
         Session.set("hairType_selected",null);
      }
  },
  'change #physical': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('physical', $(e.target).val());
         Session.set("physical_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('physical');  
         Session.set("physical_selected",null);
      }
  },
  'change #ethnics': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('ethnicity', $(e.target).val());
         Session.set("ethnicity_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('ethnicity');  
         Session.set("ethnicity_selected",null);
      }
  },
  'change #ages': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('ageRange', $(e.target).val());
         Session.set("ageRange_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('ageRange');  
         Session.set("ageRange_selected",null);
      }
  },
  'change #heights': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('height', $(e.target).val());
         Session.set("height_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('height');  
         Session.set("height_selected",null);
      }
  },
  'change #country': function (e) {
      Session.set("selected_country", e.target.value);
      if($(e.target).val()!="cualquier"){
        UsersIndex.getComponentMethods().addProps('country', $(e.target).val());
        UsersIndex.getComponentMethods().removeProps('state');  
        UsersIndex.getComponentMethods().removeProps('city'); 
        Session.set("country_selected",$(e.target).val());
      }
      else{
        UsersIndex.getComponentMethods().removeProps('country');  
        Session.set("country_selected",null);
      }
  },
  'change #state': function (e) {
      Session.set("selected_state", e.target.value);
      if($(e.target).val()!="cualquier"){
        UsersIndex.getComponentMethods().addProps('state', $(e.target).val());
        Session.set("state_selected",$(e.target).val());
      }
      else{
        UsersIndex.getComponentMethods().removeProps('state');  
        UsersIndex.getComponentMethods().removeProps('city'); 
        Session.set("state_selected",null);
      }
  },
  'change #city': function (e) {
      if($(e.target).val()!="cualquier"){
         UsersIndex.getComponentMethods().addProps('city', $(e.target).val());
         Session.set("city_selected",$(e.target).val());
      }
      else{
         UsersIndex.getComponentMethods().removeProps('city');  
         Session.set("city_selected",null);
      }
  },
   'change #tipoPersona': function(event,template){
      event.preventDefault();
      var newValue = $(event.target).val();
      if(newValue==="Proyectos"){
        FlowRouter.go('/projList');
      }
      else if(newValue==="Industrias"){
        FlowRouter.go('/industryList');
      }
      else if(newValue==="Crew"){
        FlowRouter.go('/peopleList');
      }
   },
   'click #crewSearch': function(event,template){
      event.preventDefault();
      Session.set("selected_category", null);
      Session.set("selected_country", null);
      Session.set("selected_state", null);
      Session.set("role_selected",null);
      Session.set("location_selected",null);
      Session.set("country_selected",null);
      Session.set("state_selected",null);
      Session.set("city_selected",null);
      UsersIndex.getComponentMethods().removeProps(); 
      
      FlowRouter.go("/peopleList");
    },
    'click #projSearch': function(event,template){
      event.preventDefault();
      Session.set("type_selected",null);
      Session.set("genre_selected",null);
      Session.set("status_selected",null);
      Session.set("family_selected",null);
      ProjectIndex.getComponentMethods().removeProps(); 
      FlowRouter.go("/projList");
    },
    'click #industrySearch': function(event,template){
      event.preventDefault();
      Session.set("type_selected",null);
      Session.set("year_selected",null);
      Session.set("selected_country",null);
      Session.set("selected_state",null);
      IndustryIndex.getComponentMethods().removeProps(); 
      FlowRouter.go("/industryList");
    },
    'change #searchType': function(event,template){
  event.preventDefault();
  
  var newValue = $(event.target).val();
  if(newValue==="Proyectos"){
    Session.set("type_selected",null);
    Session.set("genre_selected",null);
    Session.set("status_selected",null);
    Session.set("family_selected",null);
    ProjectIndex.getComponentMethods().removeProps(); 
    FlowRouter.go('/projList');
  }
  else if(newValue==="Industrias"){
    Session.set("type_selected",null);
    Session.set("year_selected",null);
    Session.set("selected_country",null);
    Session.set("selected_state",null);
    IndustryIndex.getComponentMethods().removeProps(); 
    FlowRouter.go('/industryList');
  }
  else if(newValue==="Cast"){
    Session.set("country_selected",null);
    Session.set("city_selected",null);
    Session.set("state_selected",null);
    Session.set("role_selected",null);
    Session.set("category_selected",null);
    Session.set("gender_selected",null);
    Session.set("eyes_selected",null);
    Session.set("hair_selected",null);
    Session.set("hairType_selected",null);
    Session.set("physical_selected",null);
    Session.set("ethnicity_selected",null);
    Session.set("ageRange_selected",null);
    Session.set("height_selected",null);
    Session.set("location_selected",null);
    Session.set("selected_category", null);
    Session.set("selected_country", null);
    Session.set("selected_state", null);
    UsersIndex.getComponentMethods().removeProps(); 
    FlowRouter.go('/peopleListCast');
  }
  else if(newValue==="Crew"){
    Session.set("selected_category", null);
    Session.set("selected_country", null);
    Session.set("selected_state", null);
    Session.set("role_selected",null);
    Session.set("location_selected",null);
    Session.set("country_selected",null);
    Session.set("state_selected",null);
    Session.set("city_selected",null);
    UsersIndex.getComponentMethods().removeProps(); 
    FlowRouter.go('/peopleList');
  }
}
   
});

