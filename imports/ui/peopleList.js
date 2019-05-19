import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { UsersIndex } from '/lib/common.js';

import './peopleList.html';
import '/lib/common.js';


Meteor.subscribe("otherUsers");
Template.peopleList.helpers({
   usersIndex: () => UsersIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
         placeholder: 'Buscar', 
         id: 'searchBox'
      }; 
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
  getCitiesFromCountries(){
      return City.find({'country': 'México'},{sort:{'city':1}}).fetch(); 
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
   personalCover(userId){
      Meteor.subscribe("personalcover");
      return PersonalCover.find({'owner': userId});
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
       var url = "";
       var user = Meteor.users.findOne({'_id':userId});
       if(user.profilePictureID!=null && user.profilePictureID!=""){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_100,h_100,c_thumb,r_max/" + user.profilePictureID;
       }
       return url;
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
    getCoverPicture(userId) {
       var url = "";
       var user = Meteor.users.findOne({'_id':userId});
       if(user.profileCoverID!=null && user.profileCoverID!=""){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_250,c_scale/" + Meteor.user().profileCoverID;
       }
       return url;
    }

   
});

Template.peopleList.events({
   'click #pushFollow': function(event, template) {
      event.preventDefault();
      //console.log("Intentando seguir a "+ Session.get('userID'));
      var user = $("#thisUser").val();
      Meteor.users.update(
         {'_id': Meteor.userId()},
         { $push: { 'follows': user } }
      );

      $("#pushFollow").attr("disabled", true);
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
   'click #tipoPersona': function(event,template){
      event.preventDefault();
      FlowRouter.go('/projList');
   }
   
});

