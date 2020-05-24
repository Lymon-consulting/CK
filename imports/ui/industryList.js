import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Media } from '../api/media.js';
import { City } from '../api/city.js';
import { UsersIndex } from '/lib/common.js';
import { ProjectIndex } from '/lib/common.js';
import { IndustryIndex } from '/lib/common.js';

import './industryList.html';
import '/lib/common.js';

Meteor.subscribe("otherUsers");
Template.industryResults.helpers({
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
   logoPicture: function (companyId, size) {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : companyId});
    var url;
    if(data!=null && data.companyLogoID!=null){
      var cover = Media.findOne({'mediaId':data.companyLogoID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_limit" + "/v" + cover.media_version + "/" + data.userId + "/" + data.companyLogoID;    
      }
      
    }
    return url;
    },
   getIndustryType(){
        var type = new Array();
        type.push("");
        type.push("PRINCIPALES");
        type.push("-----------");
        type.push("Agencia de casting");
        type.push("Catering");
        type.push("Bodega de arte");
        type.push("Bodega de vestuario");
        type.push("Canal de television");
        type.push("Casa productora");
        type.push("Casa post–productora (Imagen)");
        type.push("Casa post-productora (Audio)");
        type.push("Compañía teatral");
        type.push("Distribuidora");
        type.push("Escuelas (Cine/ medios audiovisuales)");
        type.push("Estudio de animacion");
        type.push("Estudio de grabacion");
        type.push("Exhibicion (Cine/espacios )");
        type.push("Festivales de cine");
        type.push("Musicalizacion");
        type.push("Renta de equipo");
        type.push("Renta de foro");
        type.push("Renta picture cars");
        type.push("");
        type.push("SECUNDARIAS");
        type.push("-----------");
        type.push("Agencia de extras");
        type.push("Agencia de modelos");
        type.push("Agencia de publicidad");
        type.push("Agencia fotográfica");
        type.push("Animales adiestrados para cine y televisión");
        type.push("Armero para cine y televisión");
        type.push("Aseguradora para cine y televisión");
        type.push("Baños portatiles");
        type.push("Contabilidad");
        type.push("Copywriter");
        type.push("Despacho legal");
        type.push("Diseño web");
        type.push("Diseño grafico (Posters, postales ,tipografia)");
        type.push("Doblaje");
        type.push("Drone/ Fotografía aerea");
        type.push("Editorial");
        type.push("Efectos especiales (Explosiones)");
        type.push("Estación de radio");
        type.push("Estudio de grabación (Música)");
        type.push("Estudio de grabacion (Audio/ follys/ etc)");
        type.push("Locaciones");
        type.push("Maquillaje y peinados");
        type.push("Plantas de luz");
        type.push("Utilería y props");
        type.push("Relaciones públicas");
        type.push("Renta de campers");
        type.push("Renta de transporte ( Vans/ camiones)");
        type.push("Renta de video assist");
        type.push("Stunts");
        type.push("Servicio de subtitulaje");
        type.push("Viveros");
        return type;
     },
     getIndustryYear(){
        var years = new Array();

        for(i=2018; i>1970; i--){
          years.push(i);
        }
        return years;
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
      disableIfTitle: function(value){
        var status = "";
        if(value==="PRINCIPALES" || value==="SECUNDARIAS" || value==="-----------" || value===""){
          status = "disabled";
        }
        return status;
      },
      yearSelected: function(value){
        var pyear = "";
        if(Session.get("year_selected")!=null){
          pyear = Session.get("year_selected");
        }
        else{
          pyear = "cualquier";
        }
        return (pyear === value) ? 'selected' : '' ;
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
          /*if(Meteor.user() && Meteor.user().state){
            return City.find({'state': Meteor.user().state}).fetch();    
          }
          else{*/
            return City.find({'state': 'Aguascalientes'}).fetch();    
          //}
        }
      },
      showButtonFollow(follow){
         var result = true;
         var following = Meteor.user().followCompany;
         if(following){
            for (var i = 0; i < following.length; i++) {
             if(following[i]===follow){
               result = false;
               break;
             }
           } 
         }
        return result;
      },
      notSameUser(companyId){
        val = true;
        var data = Industry.find({'userId' : Meteor.userId()}).fetch();
        for (var i = 0; i < data.length; i++) {
          if(data[0]._id === companyId){
            val = false;
            break;
          }
        }
        
        return val;
      },
});

Template.industryResults.events({
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
      if(newValue==="Proyectos"){
        FlowRouter.go('/projList');
      }
      else if(newValue==="Crew"){
        FlowRouter.go('/peopleList');
      }
      else if(newValue==="Cast"){
        FlowRouter.go('/peopleListCast');
      }
   },
   'change #type': function (e) {
      if($(e.target).val()!="cualquier"){
         IndustryIndex.getComponentMethods().addProps('company_type', $(e.target).val());
         Session.set("type_selected",$(e.target).val());
      }
      else{
         IndustryIndex.getComponentMethods().removeProps('company_type');  
         Session.set("type_selected",null);
      }
  },
  'change #year': function (e) {
      if($(e.target).val()!="cualquier"){
         IndustryIndex.getComponentMethods().addProps('company_year', $(e.target).val());
         Session.set("year_selected",$(e.target).val());
      }
      else{
         IndustryIndex.getComponentMethods().removeProps('company_year');  
         Session.set("year_selected",null);
      }
  },
  'click .pushCollaborator': function(event, template) {
      event.preventDefault();
      var companyId = event.target.id;
      Session.set("collaborator",companyId);
      FlowRouter.go('/addCollaboratorIndustry');
   },
   'change #country': function (e) {
      Session.set("selected_country", e.target.value);
      if($(e.target).val()!="cualquier"){
       IndustryIndex.getComponentMethods().addProps('country', $(e.target).val());
       Session.set("country_selected",$(e.target).val());
     }
     else{
       IndustryIndex.getComponentMethods().removeProps('country');  
       IndustryIndex.getComponentMethods().removeProps('state');  
       IndustryIndex.getComponentMethods().removeProps('city'); 
       Session.set("country_selected",null);
     }
   },
   'change #state': function (e) {
      Session.set("selected_state", e.target.value);
      if($(e.target).val()!="cualquier"){
       IndustryIndex.getComponentMethods().addProps('state', $(e.target).val());
       Session.set("state_selected",$(e.target).val());
     }
     else{
       IndustryIndex.getComponentMethods().removeProps('state');  
       IndustryIndex.getComponentMethods().removeProps('city'); 
       Session.set("state_selected",null);
     }
   },
   'change #city': function (e) {
    if($(e.target).val()!="cualquier"){
     IndustryIndex.getComponentMethods().addProps('city', $(e.target).val());
     Session.set("city_selected",$(e.target).val());
   }
   else{
     IndustryIndex.getComponentMethods().removeProps('city');  
     Session.set("city_selected",null);
   }
  },
  'click #pushFollow': function(event, template) {
    event.preventDefault();
    var companyId = $(event.target).attr("data-id");
    Meteor.users.update(
     {'_id': Meteor.userId()},
     { $push: { 'followCompany': companyId } }
    );

    var company = Industry.findOne({'_id':companyId});

    Meteor.call('addAlert', company.userId ,"", Meteor.userId(),3,null,companyId);

    //$(event.target).attr("disabled", true);
  },
  'click #stopFollowing': function(event,template){
    event.preventDefault();
    var companyId = $(event.target).attr("data-id");
    Meteor.users.update(
     {'_id': Meteor.userId()},
     { $pull: { 'followCompany': companyId } }
    );
    //Meteor.call('removeAlert', company.userId ,);
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
    'click #projSearch': function(event,template){
      event.preventDefault();
      Session.set("type_selected",null);
      Session.set("genre_selected",null);
      Session.set("status_selected",null);
      Session.set("family_selected",null);
      ProjectIndex.getComponentMethods().removeProps(); 
      FlowRouter.go("/projList");
    },
});

