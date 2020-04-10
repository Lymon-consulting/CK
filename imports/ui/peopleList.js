import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';
import { UsersIndex } from '/lib/common.js';

import './peopleList.html';
import '/lib/common.js';


Meteor.subscribe("otherUsers");

Template.peopleList.rendered = function(){
  UsersIndex.getComponentMethods().addProps('isCrew', true);
  Session.set("selected_category",null);
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
  getCategories(){
   var data = Ocupation.find({},{sort:{'title':1}}).fetch();
   return _.uniq(data, false, function(transaction) {return transaction.title});
 },
 getOcupationsFromCategory(){
  var allOcupations;
  if(Session.get("selected_category")!=null){
    allOcupations = Ocupation.find({'title': Session.get("selected_category")}).fetch();
    if(Session.get("selected_category")==="Dirección"){
      allOcupations.push({'title':'Dirección', 'secondary':'Director'});
    }
    else if(Session.get("selected_category")==="Producción"){
      allOcupations.push({'title':'Producción', 'secondary':'Productor'});
    }
  }
  else{
    allOcupations = Ocupation.find({'title': "Animacion y arte digital"}).fetch();
  }
  return allOcupations;
},
getAllOcupations(){
  return Ocupation.find({},{sort:{"secondary":1}}).fetch();
},
getAvailableYears(){
 var years = new Array();

 for(i=2018; i>1970; i--){
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
getPrimaryRoles(roles){
  var result = new Array();
  var strResult = "";
  userRoles = roles;
  for (var i = 0; i < userRoles.length; i++) {
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
        }
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
    if(user!=null && user.profilePictureID!=null){
      var profile = Media.findOne({'mediaId':user.profilePictureID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_80,h_80,c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.profilePictureID;    
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
      if(user!=null && user.profileCoverID!=null){
        var cover = Media.findOne({'mediaId':user.profileCoverID});
        if(cover!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_scale" + "/v" + cover.media_version + "/" + userId + "/" + user.profileCoverID;    
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
  if($(e.target).val()!="cualquier"){
   UsersIndex.getComponentMethods().addProps('role', $(e.target).val());
   Session.set("role_selected",$(e.target).val());
 }
 else{
   UsersIndex.getComponentMethods().removeProps('role');  
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
}

});

