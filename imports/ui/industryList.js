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

Template.industryResults.rendered = function(){
  IndustryIndex.getComponentMethods().addProps('status',true); 
  this.autorun(function(){
    window.scrollTo(0,0);
  });
}

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
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_limit" + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.companyLogoID;    
        //url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" +                         media.media_version + "/" + Meteor.settings.public.LEVEL + "/" + media.mediaId;    
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
        type.push("Agencia de publicidad ");
        type.push("Agencia de representación/ management ");
        type.push("Agencia y/o estudio doblaje/ locutores ");
        type.push("Asociación/ Organización/ Redes ");
        type.push("Bodega de arte");
        type.push("Bodega de vestuario");
        type.push("Cámaras empresariales cine y televisión");
        type.push("Canal de televisión");
        type.push("Casa post-productora (Audio)");
        type.push("Casa post-productora (Imagen)");
        type.push("Casa productora");
        type.push("Catering");
        type.push("Comisiones de filmación ");
        type.push("Distribuidora");
        type.push("Escuelas (Cine/ Medios audiovisuales)");
        type.push("Estudio de animación");
        type.push("Exhibición (Salas/ Cineclubs/ Espacios )");
        type.push("Festivales / Muestras de cine");
        type.push("Grupo Gaffer/ Staff/ Electrico ");
        type.push("Institución de gobierno");
        type.push("Locaciones");
        type.push("Musicalización/ Musica original ");
        type.push("Plataforma de streaming");
        type.push("Renta de equipo");
        type.push("Renta de equipo (audio)");
        type.push("Renta de foro/ set");
        type.push("Servicios de producción");
        type.push("Sindicatos");

        type.push("");
        type.push("SECUNDARIAS");
        type.push("-----------");
        type.push("Agencia aduanal/ logistica cine");
        type.push("Agencia de extras");
        type.push("Agencia de investigación de mercado (Cine/ publicidad)");
        type.push("Agencia de modelos");
        type.push("Agencia de trailers");
        type.push("Agencia financiera producciones audiovisuales");
        type.push("Agencia marketing cine");
        type.push("Animal wrangler");
        type.push("Armas para producciones audiovisuales");
        type.push("Aseguradora/ seguros producciones audiovisuales");
        type.push("Book actores (Servicios foto y video)");
        type.push("Colectivo/ Laboratorio cinematografico");
        type.push("Compañía baile para producciones audiovisuales");
        type.push("Compañía/ Asociación teatral");
        type.push("Contabilidad para producciones audiovisuales");
        type.push("Copywriter");
        type.push("Derechos/ copyright musical");
        type.push("Desarrollo de carpetas");
        type.push("Despacho/ Asesoría legal");
        type.push("Diseño gráfico (Posters, postales ,tipografia)");
        type.push("Diseño web ");
        type.push("Disfraces y pelucas");
        type.push("Drone/ Fotografía aérea");
        type.push("Dummies");
        type.push("Efectos caracterización (maquillaje, prostéticos, botargas)");
        type.push("Efectos SFX (Efectos especiales onset. Explosiones/ lluvia/ etc)  ");
        type.push("Efectos VFX/ CGI/ Motion  ");
        type.push("Escuela de actuación");
        type.push("Escuela de animación");
        type.push("Estudio creativo/ Art direction");
        type.push("Estudio de fotografía");
        type.push("Estudio de grabación (Música/ audio/ follys/ etc)");
        type.push("Fondos/ Premios/ Residencias/ Talleres");
        type.push("Helicópteros para producciones audiovisuales");
        type.push("Jardinería cinematográfica (Greensman)");
        type.push("Jingles");
        type.push("Laboratorio/ Revelado fotográfico");
        type.push("Limpieza/ Sanitización set");
        type.push("Maquetas para producciones audiovisuales");
        type.push("Provedores luces cinematograficas");
        type.push("Proveedores equipo de audio");
        type.push("Proveedores expendables");
        type.push("Proveedores material cinematográfico (Celuloide)");
        type.push("Proveedores material maquillaje y peinados");
        type.push("Proveedores vídeo y fotografía");
        type.push("Realidad virtual");
        type.push("Renta de campers");
        type.push("Renta de equipo especializado");
        type.push("Renta de pipas agua");
        type.push("Renta de transporte (Vans/ camionetas)");
        type.push("Renta de video assist / DIT");
        type.push("Renta de walkie talkie (radio comunicación)");
        type.push("Renta picture cars");
        type.push("Renta plantas de luz / generadores");
        type.push("Renta sanitarios moviles");
        type.push("Reproducciones");
        type.push("Revista/ Blogs/ Podcasts de cine");
        type.push("Seguridad/ Vigilancia set");
        type.push("Servicio de subtitulaje/ traducción");
        type.push("Servicios edicion");
        type.push("Servicios escritura guión/ script doctor");
        type.push("Servicios grabación sonido directo");
        type.push("Servicios streaming/ transmisión");
        type.push("Stock video y foto/ Archivo fílmico");
        type.push("Storyboard");
        type.push("Stunts");
        type.push("Video 360");
        type.push("Video mapping");

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

