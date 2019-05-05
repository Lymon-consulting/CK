import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { UsersIndex } from '/lib/common.js';

import './peopleList.html';
import '/lib/common.js';



Template.peopleList.helpers({
   usersIndex: () => UsersIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
         placeholder: 'Buscar', 
         id: 'searchBox'
      }; 
   },
   people(){

      var textFilter = Session.get('textFilter');
      var typeFilter = Session.get("typeFilter");
      var orderFilter = Session.get("orderFilter");
      var locationFilter = Session.get("locationFilter");

      var selectorText = [];
      var selectorRole = [];
      
      if (textFilter !== undefined && textFilter!="") {
         console.log("Buscando en nombres y apellidos: " + textFilter);
         selectorText.push({"profile.name": new RegExp(textFilter)});
         selectorText.push({"profile.lastname": new RegExp(textFilter)});
         selectorText.push({"profile.lastname2": new RegExp(textFilter)});
      }
      if (typeFilter !== undefined && typeFilter!="") {
        //selector.number = typeFilter;
      }
      if (orderFilter !== undefined && orderFilter!="") {
         console.log("Buscando en rol: " + orderFilter);
         //selector.push({"profile.role": new RegExp(orderFilter)});
         selectorRole.push({"profile.role": {"$in": [orderFilter]}});
      }
      if (locationFilter !== undefined && locationFilter!="") {
        //selector.push({"profile.state": new RegExp(locationFilter)});
      }
      
      /*Código de prueba*/
      //Meteor.subscribe("search", Session.get("textFilter"));
      if (Session.get("textFilter")) {
         Meteor.subscribe('otherUsers');
         //return Meteor.users.find("fullname":textFilter, {fields:{selector:1}});      
        //return Meteor.users.find({"fullname":textFilter}, { sort: [["fullname", "asc"]] });
         return Meteor.users.find({ "$and":[ selectorRole,  {"$or": [selectorText] }]});
      } 
      else {
        return Meteor.users.find({});
      }
      /*Termina código de prueba*/

      /*
      console.log("-->"+JSON.stringify(selector)+"<--");

      Meteor.subscribe("otherUsers");
      var result = Meteor.users.find(selector); 

      console.log("Encontró: " + result.count());
      return result;
      */
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
      return City.find({'country': 'México'}).fetch(); 
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
      var following = Meteor.users.find({$and : [ {'_id' : Meteor.userId()} , {"profile.follows": follow }]});

      var found = true;
      if(following.count() > 0){
         found = false;
      }
      return found;
   },

   
});

Template.peopleList.events({
   'click #pushFollow': function(event, template) {
      event.preventDefault();
      //console.log("Intentando seguir a "+ Session.get('userID'));
      var user = $("#thisUser").val();
      Meteor.users.update(
         {'_id': Meteor.userId()},
         { $push: { 'profile.follows': user } }
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
    UsersIndex.getComponentMethods()
      .addProps('city', $(e.target).val());
    ;
  }
   
});

