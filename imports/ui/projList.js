import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { UsersIndex } from '/lib/common.js';
import { ProjectIndex } from '/lib/common.js';
import { IndustryIndex } from '/lib/common.js';
import { getParam } from '/lib/functions.js';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';

import './projList.html';
import '/lib/common.js';

Meteor.subscribe("otherUsers");

Template.projList.rendered = function(){
  ProjectIndex.getComponentMethods().addProps('status',true); 
  ProjectIndex.getComponentMethods().addProps('project_family','P'); 

  
  this.autorun(function(){
    $("#fieldsForSample").hide();
    window.scrollTo(0,0);
  });
}

Template.projList.helpers({
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
   searchCount: () => {
    // index instanceof EasySearch.index
    let dict = ProjectIndex.getComponentDict(/* optional name */);

    // get the total count of search results, useful when displaying additional information
    return dict.get('count')
   },
   coverPicture: function (projectId, size) {
    Meteor.subscribe("allMedia");
    var data = Project.findOne({'_id' : projectId});
    var url;
    if(data!=null && data.projectPictureID!=null){
      var cover = Media.findOne({'mediaId':data.projectPictureID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_202,h_132,c_scale" + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.projectPictureID;    
      }
      
    }
    return url;
    /*
    Meteor.subscribe("allProjects");
      var url = "";
      var data = Project.findOne({'_id' : projectId});
      if(data!=null && data.projectPictureID!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.projectPictureID;
      }
     return url;*/
    },
    getStatus(status){
        if(status==="Terminado"){
          return "";
        }
        else{
          return "En "+status;
        }
      },
      getCategories(){
        var data = Ocupation.find({},{sort:{'title':1}}).fetch();
        return _.uniq(data, false, function(transaction) {return transaction.title});
      },
    getProfilePicture(userId, size) {
      Meteor.subscribe("allMedia");
      var user = Meteor.users.findOne({'_id':userId});
      var url;
      if(user!=null && user.profilePictureID!=null){
        var profile = Media.findOne({'mediaId':user.profilePictureID});
        if(profile!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
        }
        
      }
      return url;
      /*
       var url = "";
       var user = Meteor.users.findOne({'_id':userId});
       if(user!=null && user.profilePictureID!=null && user.profilePictureID!=""){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",h_"+size+",c_thumb,r_max/" + user.profilePictureID;
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
     getAvailableYears(){
      var years = new Array();
      var MIN_YEAR = getParam("MIN_YEAR");
      var MAX_YEAR = getParam("MAX_YEAR");
      for(i=MAX_YEAR; i>MIN_YEAR; i--){
        years.push(i);
      }
      return years;
    },
    getOcupationsFromCategory(){
      if(Session.get("selected_category")!=null){
        return Ocupation.find({'title': Session.get("selected_category")}).fetch();
      }
      else{
        return Ocupation.find({'title': "Cualquiera"}).fetch();
      }
    },

     getProjectFamily(){
      var type = new Array();
      type.push("Producciones"); //Producción
      type.push("Muestras de trabajo"); //Muestra de trabajo
      return type;
    },
    firstLetter(val){
      return val.charAt(0);
    },
     getProjectStatus(){
      var type = new Array();
      type.push("Desarrollo");
      type.push("Pre-producción");
      type.push("Producción");
      type.push("Post-producción");
      type.push("Distribución/exhibición");
      type.push("Terminado");
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
      },
      statusSelected: function(value){
        var pstatus = "";
        if(Session.get("status_selected")!=null){
          pstatus = Session.get("status_selected");
        }
        else{
          pstatus = "cualquier";
        }
        return (pstatus === value) ? 'selected' : '' ;
      },
      familySelected: function(value){
        var pfamily = "";
        if(Session.get("family_selected")!=null){
          pfamily = Session.get("family_selected");
        }
        else{
          pfamily = "cualquier";
        }
        return (pfamily === value) ? 'selected' : '' ;
      },
      getFamily:function(value){
        var result ="";
        if(value==="P"){
          result = "Producción";
        }
        else if(value==="M"){
          result = "Muestra de trabajo";
        }
        return result;
      },
      isSample:function(value){
        var result = false;
        if(value==="M"){
          result = true;
        }
        return result;
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
      if(newValue==="Crew"){
        FlowRouter.go('/peopleList');
      }
      else if(newValue==="Industrias"){
        FlowRouter.go('/industryList');
      }
      else if(newValue==="Cast"){
        FlowRouter.go('/peopleListCast');
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
  },
  'change #status': function (e) {
      if($(e.target).val()!="cualquier"){
         ProjectIndex.getComponentMethods().addProps('project_status', $(e.target).val().trim());
         Session.set("status_selected",$(e.target).val());
      }
      else{
         ProjectIndex.getComponentMethods().removeProps('project_status');  
         Session.set("status_selected",null);
      }
  },
  'change #proj_year': function(e){
    if($(e.target).val()!="cualquier"){
         ProjectIndex.getComponentMethods().addProps('project_year', $(e.target).val().trim());
         Session.set("year_selected",$(e.target).val());
      }
      else{
         ProjectIndex.getComponentMethods().removeProps('project_year');  
         Session.set("year_selected",null);
      }
  },
  'change #ocupation':function(e){
      if($(e.target).val()!="cualquier"){
         ProjectIndex.getComponentMethods().addProps('project_role', $(e.target).val().trim());
         Session.set("role_selected",$(e.target).val());
      }
      else{
         ProjectIndex.getComponentMethods().removeProps('project_role');  
         Session.set("role_selected",null);
      }
  },
  'change #family': function (e) {
      if($(e.target).val()!="cualquier"){
         ProjectIndex.getComponentMethods().addProps('project_family', $(e.target).val());
         Session.set("family_selected",$(e.target).val());
         var prod = document.getElementById("fieldsForProduction");
         var samp = document.getElementById("fieldsForSample");
         if($(e.target).val()==="P"){
            ProjectIndex.getComponentMethods().removeProps('project_role');  
            Session.set("role_selected",null);
            ProjectIndex.getComponentMethods().removeProps('project_year');  
            Session.set("year_selected",null);
            $("#fieldsForSample").hide();
            $("#fieldsForProduction").show();
            /*
            if(prod!=null && prod.style.display === "none"){
              prod.style.display = "block";  
            }
            if(samp!=null){
              samp.style.display = "none";  
            }*/
         }
         else if($(e.target).val()==="M"){
            ProjectIndex.getComponentMethods().removeProps('project_status');  
            Session.set("status_selected",null);
            ProjectIndex.getComponentMethods().removeProps('project_genre');  
            Session.set("genre_selected",null);
            ProjectIndex.getComponentMethods().removeProps('project_type');  
            Session.set("type_selected",null);
            /*
            if(samp!=null && samp.style.display === "none"){
              samp.style.display = "block";  
            }
            if(prod!=null){
              prod.style.display = "none";  
            }*/
            $("#fieldsForSample").show();
            $("#fieldsForProduction").hide();
            
         }
      }
      else{
         ProjectIndex.getComponentMethods().removeProps('project_family');  
         Session.set("family_selected",null);
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
  if(newValue==="Producciones"){
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
},
'change #category':function(event, template){
  event.preventDefault();
  Session.set("selected_category", event.currentTarget.value);
  if(event.currentTarget.value==="Cualquiera"){
    ProjectIndex.getComponentMethods().removeProps('project_role');  
    Session.set("role_selected",null);
  }
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
   
});

