import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { ProjectIndex } from '/lib/common.js';

import './projList.html';
import '/lib/common.js';

Meteor.subscribe("otherUsers");
Template.projList.helpers({
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
   coverPicture: function (projectId, size) {
    Meteor.subscribe("allProjects");
      var url = "";
      var data = Project.findOne({'_id' : projectId});
      if(data!=null && data.projectPictureID!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.projectPictureID;
      }
     return url;
    },
    getProfilePicture(userId, size) {
       var url = "";
       var user = Meteor.users.findOne({'_id':userId});
       if(user!=null && user.profilePictureID!=null && user.profilePictureID!=""){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",h_"+size+",c_thumb,r_max/" + user.profilePictureID;
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
   'change #tipoPersona': function(event,template){
      event.preventDefault();
      var newValue = $(event.target).val();
      if(newValue==="Personas"){
        FlowRouter.go('/peopleList');
      }
      else if(newValue==="Industrias"){
        FlowRouter.go('/industryList');
      }
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

