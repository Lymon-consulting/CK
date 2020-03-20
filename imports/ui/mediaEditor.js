import { Template } from 'meteor/templating';
import { Media } from '../api/media.js';

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
        Bert.alert({message: 'Tu archivo ha sido cargado' , type: 'success', icon: 'fa fa-check'});
      }
      else{
        console.log("Upload Error:"  + err); //no output on console
      }
    });
  });
}

Template.header.rendered = function(){
  $("#dragzone").css({
    "display": "none",
  });
};

Template.mediaEditor.onRendered = function(){
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
  formatDate(date){
    var d = new Date(date);
    var month = d.toLocaleString('default', { month: 'long' });
    var datestring = d.getDate()  + " " + month + " " + d.getFullYear();
    return datestring;
  },
  formatSize(size){
    if(size>0){
      var i = Math.floor( Math.log(size) / Math.log(1024) );
      return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }
    else{
      return 0;
    }
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
  },
  'change [type="text"]': function(event,template){
    var id = event.target.id;
    if(id.indexOf("title")>=0){ //es el título
      id = id.substring(id.indexOf("title")+5,id.length);
      $("#message").html("Guardando...");
      Meteor.call(
        'updateMediaTitle',
        Meteor.userId(),
        id,
        event.target.value
      );  
    }
    else if(id.indexOf("descr")>=0){ //es la descripción
      id = id.substring(id.indexOf("descr")+5,id.length);
      $("#message").html("Guardando...");
      Meteor.call(
        'updateMediaDescription',
        Meteor.userId(),
        id,
        event.target.value
      );
    }
    $("#message").html("Datos actualizados"); 
  },
  'click .delete' : function(event,template){
    if(confirm("¿Desea eliminar esta imagen?")){
      var public_id = $(event.currentTarget).attr("data-id");
      Cloudinary.delete(public_id,function(res){
        //console.log(res);
      });
      Meteor.call(
        'deleteMedia',
        Meteor.userId(),
        public_id
      );

      $('.modal').modal('hide'); 
      $('.modal-backdrop').remove();
    }
  },
  'change #type': function(event, template){
    event.preventDefault();
    var public_id = $(event.currentTarget).attr("data-id");
    var type = event.target.value;
    console.log(type);
    $('.modal').modal('hide'); 
    $('.modal-backdrop').remove();
    FlowRouter.go('/editMedia/' + public_id+'/'+type);
  }
});