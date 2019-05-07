import { Template } from 'meteor/templating';
import { ProjectIndex } from '/lib/common.js';

import './projList.html';
import '/lib/common.js';

Template.projList.helpers({
   projectIndex: () => ProjectIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
         placeholder: 'Buscar', 
         id: 'searchBox'
      }; 
   },
   coverPicture: function (id) {
      Meteor.subscribe("cover");
      return Cover.find({'project_id': id});
    },
    profilePicture(userId){
      return Images.find({'owner': userId});
   },
   getProjectType(){
        var type = new Array();
        type.push("Cortometraje");
        type.push("Largometraje");
        type.push("Comercial");
        type.push("Fashion film");
        type.push("Serie/programa televison");
        type.push("Videoclip");
        return type;
     },
     getProjectGender(){
        var type = new Array();
        type.push("Cortometraje");
        type.push("Animacion");
        type.push("Comedia");
        type.push("Documental");
        type.push("Drama");
        type.push("Ensayo");
        type.push("Experimental");
        type.push("Fantastico");
        type.push("Hibrido");
        type.push("Horror/gore");
        type.push("Infantil");
        type.push("LGBT");
        type.push("Musical");
        type.push("Sc-fi");
        type.push("Suspenso/ misterio");
        return type;
     },
     typeSelected: function(value){
        var ptype = "";
        if(Session.get("type_selected")!=null){
           ptype = Session.get("type_selected");
        }
        else{
          ptype = "cualquier";
        }
        return (ptype === value) ? 'selected' : '' ;
      },
      genreSelected: function(value){
        var pgenre = "";
        if(Session.get("genre_selected")!=null){
          pgenre = Session.get("genre_selected");
        }
        else{
          pgenre = "cualquier";
        }
        return (pgenre === value) ? 'selected' : '' ;
      }

   
});

Template.projList.events({
   'click #buscarBtn': function(event, template) {
      //event.preventDefault();
      console.log("Si entra");
      var e = jQuery.Event("keyup");
      e.keyCode = $.ui.keyCode.ENTER;
      $("#searchBox").trigger(e);

   },
   'click #tipoPersona': function(event,template){
      event.preventDefault();
      FlowRouter.go('/peopleList');
   },
   'change #type': function (e) {
      if($(e.target).val()!="cualquier"){
         ProjectIndex.getComponentMethods().addProps('project_type', $(e.target).val());
         Session.set("type_selected",$(e.target).val());
      }
      else{
         ProjectIndex.getComponentMethods().removeProps('project_type');  
         Session.set("type_selected",null);
      }
  },
  'change #genre': function (e) {
      if($(e.target).val()!="cualquier"){
         ProjectIndex.getComponentMethods().addProps('project_genre', $(e.target).val());
         Session.set("genre_selected",$(e.target).val());
      }
      else{
         ProjectIndex.getComponentMethods().removeProps('project_genre');  
         Session.set("genre_selected",null);
      }
  }
   
});

