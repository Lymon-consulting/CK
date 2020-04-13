import { Template } from 'meteor/templating';
import { Media } from '../api/media.js';
import { Project } from '../api/project.js';
import { Industry } from '../api/industry.js';

import './mediaEditor.html';

var uploadingPhotos = ReactiveVar(); // upload indicator

function uploadFiles(files, profileId) {
  _.each(files, function(file) {

    if (!file.type.match(/^image\//)) {
      // message..
      return;
    }
    // some size check
    if (file.size > 10000000) {
      Bert.alert({message: 'El archivo' + file.name +' excede los 10 MB' , type: 'danger', icon: 'fa fa-danger'});
      return;
    }
    // uploading..
    
    $.cloudinary.config({
      cloud_name: Meteor.settings.public.CLOUD
    });

    var options = {
      folder: Meteor.userId()
    };

    Cloudinary.upload(file, options, function(err,res){
      if(!err){
        console.log(res);
        var public_id = res.public_id;
        public_id = public_id.substring(public_id.indexOf("/")+1,public_id.length);
        console.log("Nuevo public id="+public_id);
        //var newData = userData.obj.width;
        //var obj = JSON.parse(res);
        //console.log("width="+res.width);
        //console.log("height="+res.height);
        Meteor.call(
          'saveMedia',
          Meteor.userId(),
          public_id,
          file.size,
          file.type,
          file.name,
          res.width,
          res.height,
          res.version,
          res.url
        );
        Bert.alert({message: 'Tus archivos han sido cargados' , type: 'success', icon: 'fa fa-check'});
      }
      else{
        console.log("Upload Error:"  + err); //no output on console
      }
    });
  });
}

Template.header.created = function(){
  $('#dropzone').removeClass('drag-over');
  $("#dragzone").css({
    "display": "none",
  });
};

Template.mediaEditor.onRendered = function(){
  $('#dropzone').removeClass('drag-over');
  $("#dragzone").css({
    "display": "none",
  });
};

Template.dragZone.helpers({
  uploading: function() { 
    return uploadingPhotos.get(); 
  },
  moreThanOne: function() { 
    return uploadingPhotos.get() > 1 ? true : false; 
  }
});

Template.dragZone.events({

  'dragover #dropzone': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    t.$('#dropzone').addClass('drag-over');
  },
  'dragleave #dropzone': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    t.$('#dropzone').removeClass('drag-over');
  },
  'dragenter #dropzone': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
  },
  'drop #dropzone': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    uploadFiles(e.originalEvent.dataTransfer.files, this._id);
    t.$('#dropzone').removeClass('drag-over');
    
    $("#dragzone").css({
      display: "none",
    });
  },        
  'change [type="file"]': function(e, t) {
    uploadFiles(e.target.files, this._id);
    
    $("#dragzone").css({
      display: "none",
    });
  },
});


Template.mediaEditor.helpers({
  getMedia() {
    Meteor.subscribe("allMedia");
    var media = Media.find({'userId': Meteor.userId()});
    return media;
  },
  getURL(mediaId){
    Meteor.subscribe("allMedia");
    var media = Media.findOne({'userId': Meteor.userId(), 'mediaId' : mediaId});
    return Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + Meteor.userId() + "/" + mediaId;
    
  },
  translateUse(media_use){
    var result = "";
    if(media_use==="profile"){
      result = "Perfil";
    }
    else if(media_use==="cover"){
      result = "Portada";
    }
    else if(media_use==="gallery"){
      result = "Galería";
    }
    else{
      result = "Sin definir";
    }
    return result;
  },
  getUse(mediaId){
    Meteor.subscribe("allMedia");
    var media = Media.findOne({'userId': Meteor.userId(), 'mediaId' : mediaId});
    var use;
    if(media!=null){
      if(media.media_use==='profile'){
        use = "Foto de perfil o logo";
      }
      else if(media.media_use==='cover'){
        use = "Foto de portada";
      }
      else if(media.media_use==='gallery'){
        use = "Galería de proyecto";
      }
      else{
        use = "Sin definir";
      }
    }
    return use;
  }
});

Template.mediaEditor.events({
  'click #toggleDropper':function(event, template){
    event.preventDefault();
    if($("#dragzone").is(":visible")){
      $("#dragzone").hide();
    }
    else{
      $("#dragzone").show();  
    }
  },
  'drop #toggleDropper': function(event,template){
    event.preventDefault();
    console.log("dropped", files);
    var reader = new FileReader();
    var name = files[0].name;
    var data = event.target.result;
    reader.readAsBinaryString(files[0]);
  },/*
  'change #type': function(event, template){
    event.preventDefault();
    var public_id = $(event.currentTarget).attr("data-id");
    var type = event.target.value;
    console.log(type);
    $('#castModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    FlowRouter.go('/editMedia/' + public_id+'/'+type);
  },*/
  'click #sendToEditor': function(event, template){
    event.preventDefault();
    var mediaId = $(event.target).attr('data-id');
    console.log("Va a editar la imagen "+mediaId);
    FlowRouter.go("/editMedia/"+mediaId+"/gallery");
  }
});