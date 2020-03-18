import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Project } from '../api/project.js';
import { IndustryIndex } from '/lib/common.js';

import './searchIndustryForProject.html';
import '/lib/common.js';

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
  Meteor.subscribe("allIndustries");
  var url = "";
  var data = Industry.findOne({'_id' : companyId});
  if(data!=null && data.companyLogoID!=null){
    url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.companyLogoID;
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
      "confirmed": true, /*Cambiar esto para activar las notificaciones*/
      "invite_sent": true /*Cambiar esto para activar las notificaciones*/
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