import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { IndustryIndex } from '/lib/common.js';
import { ProjectIndex } from '/lib/common.js';

import './searchIndustryForProject.html';
import '/lib/common.js';


Meteor.subscribe("allProjects");
Template.searchIndustryForProject.rendered = function(){
  ProjectIndex.getComponentMethods().addProps('status',true); 
  this.autorun(function(){
    window.scrollTo(0,0);
  });
}

Template.searchIndustryForProject.helpers({
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
 getProjectName(){
  var project = Project.findOne({'_id': FlowRouter.getParam('id')});
  var name = "";
  if(project!=null){
    name = project.project_title;
  }
  return name;
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
disableIfTitle: function(value){
  var status = "";
  if(value==="PRINCIPALES" || value==="SECUNDARIAS" || value==="-----------" || value===""){
    status = "disabled";
  }
  return status;
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
getIndustryYear(){
  var years = new Array();

  for(i=2018; i>1970; i--){
    years.push(i);
  }
  return years;
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
logoPicture: function (companyId, size) {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : companyId});
    var url;
    if(data!=null && data.companyLogoID!=null){
      var cover = Media.findOne({'mediaId':data.companyLogoID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_limit" + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.companyLogoID;    
      }
      
    }
    return url;
    },
getProjectID(){
  return FlowRouter.getParam('id');
},
checkParticipation(companyId){
  Meteor.subscribe('myProjects');
  var project = Project.findOne({'_id': FlowRouter.getParam('id')});
  var result="";
  if(project){
    var companies = project.companies;
    if(companies!=null && companies!=""){
      for (var i = companies.length - 1; i >= 0; i--) {
        if(companies[i]._id === companyId){
          result="checked";
          break;
        }
      }
    }
  }
  return result;
},
isCollaborator(companyId){
  var project = Project.findOne({'_id': FlowRouter.getParam('id')});
  var result=false;
  if(project){
    var companies = project.companies;
    if(companies!=null && companies!=""){
      for (var i = companies.length - 1; i >= 0; i--) {
        if(companies[i]._id === companyId){
          result=true;
          break;
        }
      }
    }   
  }
  return result;
}
});


Template.searchIndustryForProject.events({
  'click #buscarBtn': function(event, template) {
      //event.preventDefault();
      console.log("Si entra");
      var e = jQuery.Event("keyup");
      e.keyCode = $.ui.keyCode.ENTER;
      $("#searchBox").trigger(e);

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
 'click input': function(event) {
    if(event.target.checked){
      $("#but_"+event.target.value).removeAttr('disabled');
      $("#but_"+event.target.value).css('background','#ED1567');
    }
    else{
     //console.log("false");
     $("#but_"+event.target.value).attr('disabled', 'disabled');
     $("#but_"+event.target.value).css('background','#666');
   }
 },
 'click .add_collaborator' : function(e, template, doc){
  e.preventDefault();

  var projectId = FlowRouter.getParam('id');
  var companyId = e.target.value;

  var project = Project.findOne({'_id':projectId});
  if(project){

    var company = {
      "_id" : companyId,
      "confirmed": false, /*Cambiar esto para activar las notificaciones*/
      "invite_sent": false /*Cambiar esto para activar las notificaciones*/
    };

    var exists = Project.find({$and:[{"_id":projectId},{ companies: {$elemMatch:{"_id":companyId}}}]});
    if(exists.count()===0){

     Project.upsert(
       {'_id': projectId},
       { $push: { companies: company }
     });
      $("#but_"+e.target.value).html('Invitación enviada');
      $("#but_"+e.target.value).hide();
      $("#chk_"+e.target.value).attr('disabled', 'disabled');
      $("#rem_"+e.target.value).show();
    }
  }
},
'click .remove_collaborator' : function(e, template, doc){
  e.preventDefault();
  var projectId = FlowRouter.getParam('id');
  var companyId = e.target.value;
  var project = Project.findOne({'_id': projectId});

  var companyName = Industry.findOne({'_id': companyId}).company_name;
  
  if(confirm("¿Eliminar la participación de " + companyName + " de "+project.project_title+"?")){

      var company = {
       "_id": companyId
     };

     Project.upsert(
      {'_id': projectId},
      { $pull: { companies: company }
    });

     $("#but_"+e.target.value).html('Enviar invitación');
     $("#but_"+e.target.value).removeAttr('disabled');
     $("#but_"+e.target.value).show();
     $("#chk_"+e.target.value).prop( "checked", false );
     $("#chk_"+e.target.value).removeAttr('disabled');
     $("#rem_"+e.target.value).hide();
   }
 }
});