import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';
import { UsersIndex } from '/lib/common.js';
import { ProjectIndex } from '/lib/common.js';
import { IndustryIndex } from '/lib/common.js';
import { getParam } from '/lib/functions.js';
import { getRoleById } from '/lib/globals.js';
import { getCrewCategories } from '/lib/globals.js';
import { getCrewRoleFromCategory } from '/lib/globals.js';

import './peopleList.html';
import '/lib/common.js';


Meteor.subscribe("otherUsers");

Template.peopleList.rendered = function(){
  UsersIndex.getComponentMethods().addProps('isCrew', true);
  ProjectIndex.getComponentMethods().removeProps(); 
  IndustryIndex.getComponentMethods().removeProps(); 
  Session.set("selected_category",null);
  this.autorun(function(){
    window.scrollTo(0,0);
  });
}


Template.peopleList.helpers({
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
  industryIndex: () => IndustryIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
       placeholder: 'Buscar', 
       id: 'searchBox'
     }; 
   },
  getCategories(){
    var values = getCrewCategories();
    return values;
   /*var data = Ocupation.find({},{sort:{'title':1}}).fetch();
   return _.uniq(data, false, function(transaction) {return transaction.title});*/
 },
 getOcupationsFromCategory(){
  //var allOcupations;
  var object = new Array();
  if(Session.get("selected_category")!=null){
    object = getCrewRoleFromCategory(Session.get("selected_category"));
    /*
    allOcupations = Ocupation.find({'title': Session.get("selected_category")}).fetch();
    if(Session.get("selected_category")==="Dirección"){
      allOcupations.push({'title':'Dirección', 'secondary':'Dirección'});
    }
    else if(Session.get("selected_category")==="Producción"){
      allOcupations.push({'title':'Producción', 'secondary':'Producción'});
    }*/
  }
  else{
    object = getCrewRoleFromCategory("Animación y arte digital");
    //allOcupations = Ocupation.find({'title': "Animacion y arte digital"}).fetch();
  }
  return object;
},
getAllOcupations(){
  return Ocupation.find({},{sort:{"secondary":1}}).fetch();
},
isDirector(val){
  var result = false;
  if(val==="Dirección"){
    result = true;
  }
  return result;
},
isProducer(val){
  var result = false;
  if(val==="Producción"){
    result = true;
  }
  return result;
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
getPrimaryRoles(userId){
  var user = Meteor.users.findOne({'_id': userId});
  var result = new Array();
  var strResult = "";
  if(user){
     
     userRoles = user.role;
      if(userRoles){
        for (var i = 0; i < userRoles.length; i++) {
          result.push(getRoleById(userRoles[i]));
        }
      }

      for (var i = 0; i < result.length; i++) {
        strResult = strResult + ", " + result[i].roleName;
      }
      strResult = strResult.substring(2, strResult.length);
      
    }
  return strResult;
   },
   getFirstRoles(userId){
  var user = Meteor.users.findOne({'_id': userId});
  var result = new Array();
  var strResult = "";
  if(user){
     
     userRoles = user.role;
      if(userRoles){
        for (var i = 0; i < userRoles.length && i<Meteor.settings.public.MAX_ROLES_DISPLAY; i++) {
          result.push(getRoleById(userRoles[i]));
        }
      }

      for (var i = 0; i < result.length; i++) {
        strResult = strResult + ", " + result[i].roleName;
      }
      strResult = strResult.substring(2, strResult.length);

      if(userRoles!=null && userRoles.length>Meteor.settings.public.MAX_ROLES_DISPLAY){
        strResult = strResult + "..." ;
      }
      
    }
  return strResult;
   },
   showMoreRolesLink(roles){
     var result=false;
     if(roles!=null){
       if(roles.length > Meteor.settings.public.MAX_ROLES_DISPLAY){
         result = true;
       }
       else{
         result = false;
       }
     }
     return result;
   },
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
    if(user!=null && user.crew!=null && user.crew.profilePictureID!=null){
      var profile = Media.findOne({'mediaId':user.crew.profilePictureID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_80,h_80,c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.crew.profilePictureID;    
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
      if(user!=null && user.crew!=null && user.profileCoverID!=null){
        var cover = Media.findOne({'mediaId':user.crew.profileCoverID});
        if(cover!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_scale" + "/v" + cover.media_version + "/" + userId + "/" + user.crew.profileCoverID;    
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

Template.peopleList.events({
 'click #pushFollow': function(event, template) {
  event.preventDefault();

      //var user = $("#thisUser").val();
      var user = $(event.target).attr("data-id");
      //console.log("Intentando seguir a "+ user);
      Meteor.users.update(
       {'_id': Meteor.userId()},
       { $push: { 'follows': user } }
       );

      Meteor.call('addAlert', user ,"Comenzó a seguirte", Meteor.userId(),2,null,null);

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
    'change #country': function (e) {
      Session.set("selected_country", e.target.value);
      if($(e.target).val()!="cualquier"){
       UsersIndex.getComponentMethods().addProps('country', $(e.target).val());
       Session.set("country_selected",$(e.target).val());
     }
     else{
       UsersIndex.getComponentMethods().removeProps('country');  
       UsersIndex.getComponentMethods().removeProps('state');  
       UsersIndex.getComponentMethods().removeProps('city'); 
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
'change #role': function (e) {
  var val = $(e.target).val();
  if(val!="cualquier"){
   UsersIndex.getComponentMethods().addProps('role', val); 
   Session.set("role_selected",val);
 }
 else{
   UsersIndex.getComponentMethods().removeProps('role');  
   UsersIndex.getComponentMethods().removeProps('topRole');  
   Session.set("role_selected",null);
 }
},
'change #category':function(e, template){
 e.preventDefault();
 if($(e.target).val()!="cualquier"){
   Session.set("selected_category", $(e.target).val()); 
 }
 else{
   Session.set("selected_category", null);
   UsersIndex.getComponentMethods().removeProps('role');  
   Session.set("role_selected",null);
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
  else if(newValue==="Cast"){
    FlowRouter.go('/peopleListCast');
  }
},
'click #castSearch': function(event,template){
  event.preventDefault();
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
  FlowRouter.go("/peopleListCast");
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

