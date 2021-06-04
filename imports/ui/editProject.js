import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Ocupation } from '../api/ocupations.js';
import { Media } from '../api/media.js';
import { getParam } from '/lib/functions.js';
import { trimInput } from '/lib/functions.js';
import { isNotEmpty } from '/lib/functions.js';
import { uploadFiles } from '/lib/functions.js';
import { getCrewCategories } from '/lib/globals.js';
import { getCrewRoleFromCategory } from '/lib/globals.js';

import './editProject.html';
import '/lib/common.js';

var check1 = false;
var check2 = false;

Meteor.subscribe("fileUploads");

Template.editProject.rendered = function(){
  this.autorun(function(){
    window.scrollTo(0,0);
  });
}

Template.editProject.helpers({
  isOwner(){
    var result = false;
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null && data.userId!=null){
      if(data.userId === Meteor.userId()){
        result = true;
      }
    }
    return result;
  },
  projData(){
    return Project.findOne({'_id': FlowRouter.getParam('id')});
  },
  statusPublished(){
    return Project.findOne({'_id': FlowRouter.getParam('id')}).status;

  },
  isProduction(){
    var family = Project.findOne({'_id': FlowRouter.getParam('id')}).project_family;
    if(family==="P"){
      return true;
    }
    else{
      return false;
    }
  },
  typeSelected: function(value){
    var ptype = Project.findOne({'_id': FlowRouter.getParam('id')}).project_type;
    return (ptype === value) ? 'selected' : '' ;
  },
  genreSelected: function(value){
    var pgenre = Project.findOne({'_id': FlowRouter.getParam('id')}).project_genre;
    return (pgenre === value) ? 'selected' : '' ;
  },
  statusSelected: function(value){
    var pstatus = Project.findOne({'_id': FlowRouter.getParam('id')}).project_status;
    return (pstatus === value) ? 'selected' : '' ;
  },
  yearSelected: function(value){
    var pyear = Project.findOne({'_id': FlowRouter.getParam('id')}).project_year;
    return (pyear === value) ? 'selected' : '' ;
  },
  isMainProject: function(value){
    var main = Project.findOne({'_id': FlowRouter.getParam('id')});
    var verify = 'false';
    if(main!=null){
      verify = main.project_is_main;
    }
    return (verify === 'true') ? 'checked' : '' ; 
  },
  getRolesSelected: function(){
    var proj = Project.findOne({'_id': FlowRouter.getParam('id')});
    var data;
    if(proj!=null){
      data = proj.project_role;
    }
    return data;
  },
  verifyProductor(){
    var data = Project.findOne({'_id': FlowRouter.getParam('id')});
    var roles;
    var result="";
    if(data){
      roles = data.project_role;
    }
    if(roles){
      for (var i = 0; i < roles.length; i++) {
        if('Productor'===roles[i]){
          result="checked";
          break;
        }
      }
      
    }
    return result;
  },
  verifyDirector(){
    var data = Project.findOne({'_id': FlowRouter.getParam('id')});
    var roles;
    var result="";
    if(data){
      roles = data.project_role;
    }
    if(roles){
      for (var i = 0; i < roles.length; i++) {
        if('Director'===roles[i]){
          result="checked";
          break;
        }
      }
      
    }
    return result;
  },
  roleSelected: function(value){
    var result="";
    var prole = Project.findOne({'_id': FlowRouter.getParam('id')}).project_role;
    var elem = prole.indexOf(value);
    if(elem >= 0){
      result = 'selected';
    }
    else{
      result = "";
    }     
    return result;
  },
  getProjectType(){
    var type = new Array();
    type.push("Cortometraje");
    type.push("Largometraje");
    type.push("Comercial");
    type.push("Fashion film");
    type.push("Serie/programa televison");
    type.push("Serie web");
    type.push("Videoclip");
    return type;
  },
  getProjectGender(){
    var type = new Array();
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
  getAvailableYears(){
    var years = new Array();
    var MIN_YEAR = getParam("MIN_YEAR");
    var MAX_YEAR = getParam("MAX_YEAR");
    for(i=MAX_YEAR; i>MIN_YEAR; i--){
      years.push(i);
    }
    return years;
  },
  getCategories(){
    //var data = Ocupation.find({},{sort:{'title':1}}).fetch();
    //return _.uniq(data, false, function(transaction) {return transaction.title});
    var values = getCrewCategories();
    return values;
  },
  getOcupationsFromCategory(){
    /*if(Session.get("selected_category")!=null){
      return Ocupation.find({'title': Session.get("selected_category")}).fetch();
    }
    else{
      return Ocupation.find({'title': "Animacion y arte digital"}).fetch();
    }*/
    var object = new Array();
      if(Session.get("selected_category")!=null){
        object = getCrewRoleFromCategory(Session.get("selected_category"));

        //return Ocupation.find({'title': Session.get("selected_category")}).fetch();
      }
      else{
        object = getCrewRoleFromCategory("Animación y arte digital");
        //return Ocupation.find({'title': "Animacion y arte digital"}).fetch();
      }
      return object;
  },
  roleSelected: function(value){
    var result="";
    var prole;
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null){
      prole = data.project_role;  
    }
    if(prole){
      var elem = prole.indexOf(value);
      if(elem >= 0){
        result = 'selected';
      }
      else{
        result = "";
      }

    }
    return result;
  },

  typeSelected: function(value){
    var result="";
    var prole;
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null){
      prole = data.project_type;  
    }
    
    if(prole){
      var elem = prole.indexOf(value);
      if(elem >= 0){
        result = 'selected';
      }
      else{
        result = "";
      } 
    }
    return result;
  },
  genderSelected: function(value){
    var result="";
    var prole;
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null){
      prole = data.project_genre;  
    }
    
    if(prole){
      var elem = prole.indexOf(value);
      if(elem >= 0){
        result = 'selected';
      }
      else{
        result = "";
      } 
    }
    return result;
  },
  statusSelected: function(value){
    var result="";
    var pstatus;
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null){
      pstatus = data.project_status;  
    }

    if(pstatus){

      if(pstatus.trim()===value.trim()){
        result = 'selected';
      }
    }
    /*
    if(pstatus){
      var elem = pstatus.indexOf(value);
      console.log(elem);
      if(elem >= 0){
        result = 'selected';
      }
      else{
        result = "";
      } 
    }*/
    return result;
  },
  yearSelected: function(value){
    var result="";
    var prole;
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null){
      prole = data.project_year;  
    }
    
    if(prole){
      var elem = prole.indexOf(value);
      if(elem >= 0){
        result = 'selected';
      }
      else{
        result = "";
      } 
    }
    return result;
  },
  getMedia() {
    Meteor.subscribe("allMedia");
    var media = null;
    //media = Media.find({'userId': Meteor.userId()},{sort:{'media_date':-1}});
    var media = Media.find({'projectId': FlowRouter.getParam("id")},{sort:{'media_date':-1}});
    if(media.count()>0){
      return media;  
    }
    else{
      return null;
    }
    
  },
  getProjectPicture() {
    Meteor.subscribe("allMedia");
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    var url;
    if(data!=null && data.projectPictureID!=null){
      var cover = Media.findOne({'mediaId':data.projectPictureID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_250,c_scale" + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.projectPictureID;    
      }
      
    }
    return url;
  },
  getProjectPoster() {
    Meteor.subscribe("allMedia");
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    var url;
    if(data!=null && data.projectPosterID!=null){
      var poster = Media.findOne({'mediaId':data.projectPosterID});
      if(poster!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_250,c_scale" + "/v" + poster.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.projectPosterID;    
      }
      
    }
    return url;
  },
  getPublicID(){
    var projectPictureID="";
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null){
      projectPictureID = data.projectPictureID;
    }
    return projectPictureID;
  },
  resume(){
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    var resume="";
    var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
    if(data!=null && data.project_desc!=null){
      resume = data.project_desc;
      $('#max').text(MAX_CHAR_IN_TEXTAREA - resume.length);
    }
    else{
      $('#max').text(MAX_CHAR_IN_TEXTAREA); 
    }
    return resume;
  },
  resumeCount(data){
    var result = 0;
    if(data!=null && data.length!=null){
      result = (450 - data.length);
    }
    return result;
  },
  getGallery(){
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    var array = new Array();
    
    if(data){
      if(data.gallery){
        for (var i = 0; i < data.gallery.length; i++) {
          var obj = {};
          obj.mediaId = data.gallery[i];

          if(i==0){
            obj.position = 1;
          }
          else{
            obj.position = 2;
          }
           array.push(obj);
          
        }
      }
    }
    return array;
  },
  isFirstElement(position){
    var result = false;
    if(position==1){
      result = true;
    }
    else{
      result = false;
    }
    return result;
  },
  getURL(mediaId){
    var url = "";
    var media = Media.findOne({'mediaId':mediaId});
      if(media!=null){
        //url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + Meteor.userId() + "/" + media.mediaId;    
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + Meteor.settings.public.LEVEL + "/" + media.mediaId;    
      }
    return url;
    //https://res.cloudinary.com/drhowtsxb/image/upload/v1620066631/development/project/dE8kMbXs5ieRMcTjF/uafxj2putskj5pl3eqnz.jpg
    //https://res.cloudinary.com/drhowtsxb/image/upload/v1620066631/eHMWXkcHztm5kzmTN/project/dE8kMbXs5ieRMcTjF/uafxj2putskj5pl3eqnz
  },
  verifyChecked(mediaId){
    var data = Project.findOne({'_id' : FlowRouter.getParam("id")});
    var gallery = new Array();
    var result="";
    if(data){
      if(data.gallery){
        gallery = data.gallery;
        if(gallery && gallery.length>0){
          for (var i = 0; i < gallery.length; i++) {
            if(mediaId===gallery[i]){
              result="checked";
              break;
            }
          }
        }
      }
      
    }
    return result;
  },
  hasMedia() {
    Meteor.subscribe("allMedia");
    //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    //var media = Media.find({'userId': Meteor.userId()}).count();
    var media = Media.find({'projectId': FlowRouter.getParam("id")}).count();
    var hasMedia = false;
    if(media > 0){
      hasMedia = true;
    }
    return hasMedia;
  },
  maxLength(){
    return getParam("MAX_CHAR_IN_TEXTAREA");
  }
});

Template.editProject.events({
  /*
  'change #proj_name': function(event, template) {
    event.preventDefault();
    var proj_name = trimInput(event.target.value);
    Meteor.call('updateProjectTitle', FlowRouter.getParam("id"), proj_name);  
  },
  'change #proj_type': function(event, template) {
    event.preventDefault();
    var proj_type = trimInput(event.target.value);
    Meteor.call('updateProjectType', FlowRouter.getParam("id"), proj_type);  
  },
  'change #proj_gender': function(event, template) {
    event.preventDefault();
    var proj_gender = trimInput(event.target.value);
    Meteor.call('updateProjectGenre', FlowRouter.getParam("id"), proj_gender);  
  },
  'change #proj_status': function(event, template) {
    event.preventDefault();
    var proj_status = trimInput(event.target.value);
    Meteor.call('updateProjectStatus', FlowRouter.getParam("id"), proj_status);  
  },
  'change #proj_desc': function(event, template) {
    event.preventDefault();
    var proj_desc = trimInput(event.target.value);
    Meteor.call('updateProjectDescription', FlowRouter.getParam("id"), proj_desc);  
  },
  'change #proj_year': function(event, template) {
    event.preventDefault();
    var proj_year = trimInput(event.target.value);
    Meteor.call('updateProjectYear', FlowRouter.getParam("id"), proj_year);  
  },
  'change #proj_web_page': function(event, template) {
    event.preventDefault();
    var proj_web_page = trimInput(event.target.value);
    Meteor.call('updateProjectWeb', FlowRouter.getParam("id"), proj_web_page);  
  },
  'change #proj_facebook_page': function(event, template) {
    event.preventDefault();
    var proj_facebook_page = trimInput(event.target.value);
    Meteor.call('updateProjectFacebook', FlowRouter.getParam("id"), proj_facebook_page);  
  },
  'change #proj_twitter_page': function(event, template) {
    event.preventDefault();
    var proj_twitter_page = trimInput(event.target.value);
    Meteor.call('updateProjectTwitter', FlowRouter.getParam("id"), proj_twitter_page);  
  },
  'change #proj_vimeo_page': function(event, template) {
    event.preventDefault();
    var proj_vimeo_page = trimInput(event.target.value);
    Meteor.call('updateProjectVimeo', FlowRouter.getParam("id"), proj_vimeo_page);  
  },
  'change #proj_youtube_page': function(event, template) {
    event.preventDefault();
    var proj_youtube_page = trimInput(event.target.value);
    Meteor.call('updateProjectYoutube', FlowRouter.getParam("id"), proj_youtube_page);  
  },
  'change #proj_instagram_page': function(event, template) {
    event.preventDefault();
    var proj_instagram_page = trimInput(event.target.value);
    Meteor.call('updateProjectInstagram', FlowRouter.getParam("id"), proj_instagram_page);  
  },
  'change #proj_external_view': function(event, template) {
    event.preventDefault();
    var proj_external_view = trimInput(event.target.value);
    Meteor.call('updateProjectExternalView', FlowRouter.getParam("id"), proj_external_view);  
  },
  
*/

  
  'change #proj_main': function(event) {
    /*Si cambia el estatus de proyecto principal poner todos los proyectos del usuario en falso*/
    userProjects = Project.find({userId: Meteor.userId()}).fetch();
    userProjects.forEach(function(current_value) {
                  Meteor.call(
                    'updateMain',
                    current_value._id,
                    false
                    );    
                });
    /*Si el estatus seleccionado es checked poner este proyecto como principal*/
    if ($('#proj_main').is(":checked")){
      Meteor.call(
        'updateMain',
        FlowRouter.getParam("id"),
        true
      );
    }
  },
  
  'click .save': function(event, template) {
    event.preventDefault();

    /*Verificar qué botón oprimió*/
    var button = $(event.currentTarget).attr("publish");

    /*Validar si es una producción o una muestra*/
    var data = Project.findOne({'_id' : FlowRouter.getParam("id")});

    if(data.project_family!=null && data.project_family==='M'){
      /*Validar los datos obligatorios para una muestra*/
      var proj_name = trimInput($('#proj_name').val());
      var proj_year = $('#proj_year').val();
      var proj_area = $('#selection').val();

      if(!isNotEmpty(proj_name)){
        Bert.alert({message: 'Por favor rellena el nombre del proyecto', type: 'error', icon: 'fa fa-times'});
      }
      else if(!isNotEmpty(proj_year)){
        Bert.alert({message: 'Por favor rellena el año del proyecto', type: 'error', icon: 'fa fa-times'});
      }
      else if(!isNotEmpty(proj_area)){
        Bert.alert({message: 'Por favor selecciona el área de tu proyecto', type: 'error', icon: 'fa fa-times'});
      }
      else{
        var status = false;
        var msg = "";
        if(button==="true"){
          status = true;
          msg = "Los datos de tu proyecto han sido actualizados y ahora se encuentra publicado";
        }
        else if(button==="false"){
          status = false;
          msg="Los datos de tu proyecto han sido actualizados, se ha guardado como borrador";
        }
        Meteor.call(
         'updateProjectSample',
         FlowRouter.getParam('id'),
         proj_name,
         proj_year,
         status
         );
        
        Bert.alert({message: msg, type: 'success', icon: 'fa fa-check'});
        //FlowRouter.go('/projectPage/' + FlowRouter.getParam('id'));
      }

      
    }
    else if(data.project_family!=null && data.project_family==='P'){
      /*Validar los datos obligatorios para una producción*/
      var proj_name = trimInput($('#proj_name').val());
      var proj_year = $('#proj_year').val();
      var proj_genre = $('#proj_gender').val();
      var proj_status = $('#proj_status').val();
      var proj_type = $('#proj_type').val();
      var proj_desc = trimInput($('#proj_desc').val());
      var proj_web_page = trimInput($('#proj_web_page').val());
      var proj_facebook_page = trimInput($('#proj_facebook_page').val());
      var proj_twitter_page = trimInput($('#proj_twitter_page').val());
      var proj_instagram_page = trimInput($('#proj_instagram_page').val());
      var proj_vimeo_page = trimInput($('#proj_vimeo_page').val());
      var proj_youtube_page = trimInput($('#proj_youtube_page').val());
      var proj_external_view = trimInput($('#proj_external_view').val());


      if(!isNotEmpty(proj_name)){
        Bert.alert({message: 'Por favor rellena el nombre del proyecto', type: 'error', icon: 'fa fa-times'});
      }
      else if(!isNotEmpty(proj_year)){
        Bert.alert({message: 'Por favor rellena el año del proyecto', type: 'error', icon: 'fa fa-times'});
      }
      else if(!isNotEmpty(proj_genre)){
        Bert.alert({message: 'Por favor rellena el género del proyecto', type: 'error', icon: 'fa fa-times'});
      }
      else if(!isNotEmpty(proj_status)){
        Bert.alert({message: 'Por favor rellena el estatus del proyecto', type: 'error', icon: 'fa fa-times'});
      }
      else if(!isNotEmpty(proj_type)){
        Bert.alert({message: 'Por favor rellena el tipo de proyecto', type: 'error', icon: 'fa fa-times'});
      }
      else if(!isNotEmpty(proj_desc)){
        Bert.alert({message: 'Por favor rellena la descripción del proyecto', type: 'error', icon: 'fa fa-times'});
      }
      else{
        var status = false;
        var msg = "";
        if(button==="true"){
          status = true;
          msg = "Los datos de tu proyecto han sido actualizados y ahora se encuentra publicado";
        }
        else if(button==="false"){
          status = false;
          msg="Los datos de tu proyecto han sido actualizados, se ha guardado como borrador";
        }
       
        Meteor.call(
         'updateProjectProduction',
         FlowRouter.getParam('id'),
         proj_name,
         proj_year,
         proj_genre,
         proj_status,
         proj_type,
         proj_desc, 
         proj_web_page,
         proj_facebook_page,
         proj_twitter_page,
         proj_instagram_page,
         proj_vimeo_page,
         proj_youtube_page,
         proj_external_view,
         status
         );

        Bert.alert({message: msg, type: 'success', icon: 'fa fa-check'});

      }
    }

    return false;
  },
  'click #saveAndPublish': function(event, template){
      event.preventDefault();
      FlowRouter.go("/projectPage/" + FlowRouter.getParam("id"));
    },
  /*
  'click #deleteFileButton ': function (event) {
     //console.log("deleteFile button ", this);
     event.preventDefault();
     if(confirm("¿Eliminar imagen de portada?")){
        //Cover.remove({_id:this._id}); 
        var public_id = $(event.target).attr('data-id');
        console.log("Borrando "+ public_id);
        console.log(Cloudinary);
        Cloudinary.delete(public_id,function(res){
         console.log(res);
       });
        Meteor.call(
          'deleteProjectPicture',
          FlowRouter.getParam('id'),
          public_id
          );
      }
      
    },*/
    'click #selectCoverForProject': function(event,template){
      event.preventDefault();
      var mediaId = $(event.currentTarget).attr("data-id");
      Meteor.call(
        'saveProjectPictureID',
        FlowRouter.getParam('id'),
        mediaId
      );

      $('#modal2').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
   },
   'click .goMediaLibrary': function(event,template){
      event.preventDefault();
      $('#modal1').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/project/"+FlowRouter.getParam("id")+"/cover");
  },
  'click .goMediaLibraryCover': function(event,template){
      event.preventDefault();
      $('#modal2').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/project/"+FlowRouter.getParam("id")+"/cover");
  },
  'click .goMediaLibraryPoster': function(event,template){
      event.preventDefault();
      $('#modal3').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/project/"+FlowRouter.getParam("id")+"/poster");
  },
  'click .goMediaLibraryGallery': function(event,template){
      event.preventDefault();
      $('#modal4').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/project/"+FlowRouter.getParam("id")+"/gallery");
  },
  'click #openMediaCover': function(event,template){
    event.preventDefault();
    $(".media-thumb").css('border','none');
    $("#setCoverPicture").addClass('disabled');
    $('#modal2').modal('show');
  },
  'click #openMediaPoster': function(event,template){
    event.preventDefault();
    $(".media-thumb").css('border','none');
    $("#setPosterPicture").addClass('disabled');
    $('#modal3').modal('show');
  },
  'click #selectPosterPicture': function(event,template){
     event.preventDefault();
      var mediaId = $(event.currentTarget).attr("data-id");

      Session.set("mediaId",mediaId);

     $(".media-thumb").css('border','none');
     $(event.target).css('border', "solid 3px #ED1567");
     $("#setPosterPicture").removeClass('disabled');

    },
    'click #setPosterPicture': function(event,template){
     event.preventDefault();
     var mediaId = Session.get("mediaId");

      Meteor.call(
        'saveProjectPosterID',
        FlowRouter.getParam('id'),
        mediaId
      );

      $('#modal3').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      $("#setPosterPicture").removeClass('disabled');

    },
  'click #selectCoverPicture': function(event,template){
     event.preventDefault();
      var mediaId = $(event.currentTarget).attr("data-id");

      Session.set("mediaId",mediaId);

     $(".media-thumb").css('border','none');
     $(event.target).css('border', "solid 3px #ED1567");
     $("#setCoverPicture").removeClass('disabled');

    },
    'click #setCoverPicture': function(event,template){
     event.preventDefault();
     var mediaId = Session.get("mediaId");

      Meteor.call(
        'saveProjectPictureID',
        FlowRouter.getParam('id'),
        mediaId
      );

      $('#modal2').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      $("#setCoverPicture").removeClass('disabled');

    },
  'change #category':function(event, template){
    event.preventDefault();
    Session.set("selected_category", event.currentTarget.value);
  },
  'click #ocupation':function(event, template){
    event.preventDefault();
    //console.log("detectó doble click " + FlowRouter.getParam('id') + ","+ event.currentTarget.value);
    /*
    Meteor.call(
      'removeAllRolesFromProject',
      FlowRouter.getParam('id')
    );    */
    
    Meteor.call(
      'addRoleToProject',
      FlowRouter.getParam('id'),
      event.currentTarget.value
    );
  },
  'click #selection':function(event, template){
    event.preventDefault();
   
    Meteor.call(
      'removeRoleFromProject',
      FlowRouter.getParam('id'),
      event.currentTarget.value
    );
  },
  'change #cover-upload': function(event, template){
    var file = event.target.files[0];

    $.cloudinary.config({
      cloud_name:"drhowtsxb"
    });

    var options = {
      folder: Meteor.userId(),
      transformation:"limit"
    };

    Cloudinary.upload(file, options, function(err,res){
      if(!err){
        Meteor.call(
          'saveProjectPictureID',
          FlowRouter.getParam('id'),
          res.public_id
          );
      }
      else{
        console.log("Upload Error:"  + err); //no output on console
      }
    });
  },
  'click #cloudinary-upload-widget': function click(event) {
    event.preventDefault();
    cloudinary.openUploadWidget(
    {
      cloud_name: 'drhowtsxb',
      upload_preset: 'limit',
      sources: ['local', 'url', 'camera'],
      cropping: 'server',
      cropping_aspect_ratio: 1,
      max_file_size: '500000',
      max_image_width: '500',
      max_image_height: '500',
      min_image_width: '300',
      min_image_height: '300',
    },
    (error, result) => {
      if (error) {
        console.log('Error during Cloudinary upload: ', error);
        return;
      }
      // Otherwise get the form elements
      // console.log('Cloudinary results: ', result);
      const fileName = result[0].original_filename;
      const thumbnail = result[0].thumbnail_url;
      const url = result[0].url;
      $("input[name='cloudinaryFileName']").val(fileName);
      $("input[name='cloudinaryUrl']").val(url);
      $("input[name='cloudinaryThumbnail']").val(thumbnail);
    });
  },
  'keyup #proj_desc' : function(event){
     event.preventDefault();
     var len = $('#proj_desc').val().length;
     if(len > getParam("MAX_CHAR_IN_TEXTAREA")){
      val.value= val.value.substring(0,getParam("MAX_CHAR_IN_TEXTAREA"));
    }
    else{
      $('#max').text(getParam("MAX_CHAR_IN_TEXTAREA")-len);
    }
  },
  'change .profile'(event, instance) {
    //console.log(event.target.id + " - " + event.target.checked);
    if(event.target.id==="check1"){
      if(event.target.checked){
        check1 = true;
        Meteor.call(
          'addRoleToProject',
          FlowRouter.getParam('id'),
          'Productor'
        );
      }
      else{
        check1 = false;
        Meteor.call(
          'removeRoleFromProject',
          FlowRouter.getParam('id'),
          'Productor'
        );
      }
    }
    if(event.target.id==="check2"){
      if(event.target.checked){
        check2 = true;
        Meteor.call(
          'addRoleToProject',
          FlowRouter.getParam('id'),
          'Director'
        );
      }
      else{
        check2 = false;
        Meteor.call(
          'removeRoleFromProject',
          FlowRouter.getParam('id'),
          'Director'
        );
      }
    }

  },
  'change .check':function(event,template){
    event.preventDefault();
    var mediaId = $(event.currentTarget).attr("data-id");
    if(event.target.checked){
      Meteor.call('addGalleryProject', FlowRouter.getParam("id"), mediaId);
    }
    else{
      Meteor.call('removeGalleryProject', FlowRouter.getParam("id"), mediaId); 
    }
  },
  'change [type="file"]': function(e, t) {
        uploadFiles(e.target.files, FlowRouter.getParam("id"), 3);
        
      },
      /*
    'click #save': function(event, template){
      event.preventDefault();
      Bert.alert({message: 'Se ha guardado tu proyecto', type: 'success', icon: 'fa fa-check'});
    },*/
    
});



