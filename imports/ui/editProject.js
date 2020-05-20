import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Ocupation } from '../api/ocupations.js';
import { Media } from '../api/media.js';
import { getParam } from '/lib/functions.js';

import './editProject.html';
import '/lib/common.js';

var check1 = false;
var check2 = false;

Meteor.subscribe("fileUploads");

var trimInput= function(val){
  if(val!=null){
    return val.replace(/^\s*|\s*$/g, "");  
  }
  return false;
}

var isNotEmpty=function(val){
  if(val && val!== ""){
    return true;
  }
  //  Bert.alert("", "danger", "growl-top-right");
  Bert.alert({message: 'Por favor completa todos los campos obligatorios', type: 'danger', icon: 'fa fa-exclamation'});
  return false;
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
  typeSelected: function(value){
    var ptype = Project.findOne({'_id': FlowRouter.getParam('id')}).project_type;
    return (ptype === value) ? 'selected' : '' ;
  },
  genreSelected: function(value){
    var pgenre = Project.findOne({'_id': FlowRouter.getParam('id')}).project_genre;
    return (pgenre === value) ? 'selected' : '' ;
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
    var data = Ocupation.find({},{sort:{'title':1}}).fetch();
    return _.uniq(data, false, function(transaction) {return transaction.title});
  },
  getOcupationsFromCategory(){
    if(Session.get("selected_category")!=null){
      return Ocupation.find({'title': Session.get("selected_category")}).fetch();
    }
    else{
      return Ocupation.find({'title': "Animacion y arte digital"}).fetch();
    }
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
    //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    var media = Media.find({'userId': Meteor.userId()},{sort:{'media_date':-1}});
    return media;
  },
  getProjectPicture() {
    Meteor.subscribe("allMedia");
    var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
    var url;
    if(data!=null && data.projectPictureID!=null){
      var cover = Media.findOne({'mediaId':data.projectPictureID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_250,c_scale" + "/v" + cover.media_version + "/" + Meteor.userId() + "/" + data.projectPictureID;    
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
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_250,c_scale" + "/v" + poster.media_version + "/" + Meteor.userId() + "/" + data.projectPosterID;    
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
  resumeCount(data){
    var result = 0;
    if(data!=null && data.length!=null){
      result = (450 - data.length);
    }
    return result;
  },
});

Template.editProject.events({
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
  


  
  'change #proj_main': function(event) {
    var x = event.target.checked;
    $('#isMainProject').val(x);
    //console.log($('#isMainProject').val());
  },
  /*
  'click #guardar_proyecto': function(event, template) {
    event.preventDefault();
    var proj_name = trimInput($('#proj_name').val());
    var proj_type = $('#proj_type').val();
    var proj_genre = $('#proj_gender').val();
    var proj_desc = trimInput($('#proj_desc').val());
    var proj_year = $('#proj_year').val();
    var proj_role = $('#selection').val();
    var proj_main = $('#isMainProject').val();
    var proj_web_page = trimInput($('#proj_web_page').val());
    var proj_facebook_page = trimInput($('#proj_facebook_page').val());
    var proj_twitter_page = trimInput($('#proj_twitter_page').val());
    var proj_vimeo_page = trimInput($('#proj_vimeo_page').val());
    var proj_youtube_page = trimInput($('#proj_youtube_page').val());
    var proj_instagram_page = trimInput($('#proj_instagram_page').val());

    if(isNotEmpty(proj_name) && 
      isNotEmpty(proj_type) && 
      isNotEmpty(proj_genre) && 
      isNotEmpty(proj_desc) &&
      isNotEmpty(proj_year) &&
      isNotEmpty(proj_role)){
      if(proj_main==='true'){
        otherProjects = Project.find({userId: Meteor.userId()}).fetch();
        otherProjects.forEach(function(current_value) {
                  //Project.update({_id: current_value._id},{$set:{"project_is_main": "" }});   
                  Meteor.call(
                    'updateMain',
                    current_value._id
                    );    
                });
      }
      Meteor.call(
       'updateProject',
       FlowRouter.getParam('id'),
       proj_name,
       proj_type,
       proj_genre,
       proj_desc, 
       proj_year,
       proj_main,
       proj_web_page,
       proj_facebook_page,
       proj_twitter_page,
       proj_vimeo_page,
       proj_youtube_page,
       proj_instagram_page
       );
      
      Bert.alert({message: 'El proyecto ha sido modificado con éxito', type: 'success', icon: 'fa fa-check'});
      FlowRouter.go('/projectPage/' + FlowRouter.getParam('id'));

    }
    return false;
  },
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
     $(event.target).css('border', "solid 3px blue");
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
     $(event.target).css('border', "solid 3px blue");
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
  'dblclick #ocupation':function(event, template){
    event.preventDefault();
    //console.log("detectó doble click " + FlowRouter.getParam('id') + ","+ event.currentTarget.value);
    Meteor.call(
      'addRoleToProject',
      FlowRouter.getParam('id'),
      event.currentTarget.value
    );
  },
  'dblclick #selection':function(event, template){
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
    if(len > 450){
      val.value= val.value.substring(0,450);
    }
    else{
      $('#max').text(450-len);
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
});



