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

        var type = FlowRouter.getParam("type"); // cover, logo, profile, gallery_industry, gallery_project, gallery_cast
        
        Meteor.call(
            'updateMetaData',
            Meteor.userId(),
            public_id,
            res.bytes,
            res.width,
            res.height,
            res.version,
            res.url,
            type
          );

        if(FlowRouter.getParam("from")!=null){
          if(FlowRouter.getParam("from")==="cast"){
            if(FlowRouter.getParam("type")==="profile"){
              Meteor.call(
              'updateProfilePicture',
              FlowRouter.getParam("returnTo"),
              public_id
              );
              FlowRouter.go("/editProfileActor/"+Meteor.userId());
            }
            else if(FlowRouter.getParam("type")==="cover"){
              Meteor.call(
              'updateCoverPicture',
              FlowRouter.getParam("returnTo"),
              public_id
              );
              FlowRouter.go("/editProfileActor/"+Meteor.userId());
            }
            else if(FlowRouter.getParam("type")==="gallery_cast"){
              Meteor.call(
              'addGalleryCast',
              FlowRouter.getParam("returnTo"),
              public_id
              );
              FlowRouter.go("/editProfileActor/"+Meteor.userId());
            }
            
          }
          else if(FlowRouter.getParam("from")==="crew"){
            if(FlowRouter.getParam("type")==="profile"){
              Meteor.call(
              'updateProfilePicture',
              FlowRouter.getParam("returnTo"),
              public_id
              );
              FlowRouter.go("/editProfile/"+Meteor.userId());
            }
            else if(FlowRouter.getParam("type")==="cover"){
              Meteor.call(
              'updateCoverPicture',
              FlowRouter.getParam("returnTo"),
              public_id
              );
              FlowRouter.go("/editProfile/"+Meteor.userId());
            }
            
          }
          else if(FlowRouter.getParam("from")==="industry"){
            if(FlowRouter.getParam("type")==="logo"){
              Meteor.call(
              'saveCompanyLogoID',
              FlowRouter.getParam("returnTo"),
              public_id
              );
              FlowRouter.go("/editIndustry/"+FlowRouter.getParam("returnTo"));
            }
            else if(FlowRouter.getParam("type")==="cover"){
              Meteor.call(
              'saveCompanyCoverID',
              FlowRouter.getParam("returnTo"),
              public_id
              ); 
              FlowRouter.go("/editIndustry/"+FlowRouter.getParam("returnTo"));
            }
            
          }
          else if(FlowRouter.getParam("from")==="project"){
            if(FlowRouter.getParam("type")==="cover"){
              Meteor.call(
              'saveProjectPictureID',
              FlowRouter.getParam("returnTo"),
              public_id
              );
              FlowRouter.go("/editProject/"+FlowRouter.getParam("returnTo"));
            }
          }
        }
      }
      else{
        console.log("Upload Error:"  + err); //no output on console
      }
    });
  });
}


Template.mediaEditor.rendered = function(){
  Meteor.setTimeout(function(){
    $('#dropzone').removeClass('drag-over');
    $("#dragzone").css({
      "display": "none",
    });
  }, 1000);

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
  getReturnButton(){
    var result="";
    if(FlowRouter.getParam("from")!=null){
      if(FlowRouter.getParam("from")==="cast"){
        result = "<a class='btn btn-purple' href='/editProfileActor/"+Meteor.userId()+"'>Regresar a tus datos de perfil</a>";
      }
      else if(FlowRouter.getParam("from")==="crew"){
        result = "<a class='btn btn-purple' href='/editProfile/"+Meteor.userId()+"'>Regresar a tus datos de perfil</a>";
      }
      else if(FlowRouter.getParam("from")==="industry"){
        result = "<a class='btn btn-purple' href='/editIndustry/"+FlowRouter.getParam("returnTo")+"'>Regresar a los datos de la empresa</a>";
      }
      else if(FlowRouter.getParam("from")==="project"){
        result = "<a class='btn btn-purple' href='/editProject/"+FlowRouter.getParam("returnTo")+"'>Regresar a los datos del proyecto</a>";
      }
    }
    return result;
  },
  getMedia() {
    Meteor.subscribe("allMedia");
    var media = Media.find({'userId': Meteor.userId()},{sort: {'media_date':-1} });
    return media;
  },
  getURL(mediaId){
    Meteor.subscribe("allMedia");
    var media = Media.findOne({'userId': Meteor.userId(), 'mediaId' : mediaId});
    return Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + Meteor.userId() + "/" + mediaId;
    
  },
  translateUse(media_use){
    use = "Sin definir";
    if(media_use!=null){
      if(media_use==='profile'){
        use = "Foto de perfil";
      }
      else if(media_use==='cover'){
        use = "Foto de portada";
      }
      else if(media_use==='logo'){
        use = "Logo";
      }
      else if(media_use==='gallery_industry'){
        use = "Galería de empresa";
      }
      else if(media_use==='gallery_project'){
        use = "Galería de proyecto";
      }
      else if(media_use==='gallery_cast'){
        use = "Galería personal";
      }
      else{
        use = "Sin definir";
      }
    }
    return use;
  },
  getUse(mediaId){
    Meteor.subscribe("allMedia");
    var media = Media.findOne({'userId': Meteor.userId(), 'mediaId' : mediaId});
    var use = "Sin definir";
    if(media!=null){
      if(media.media_use==='profile'){
        use = "Foto de perfil";
      }
      else if(media.media_use==='cover'){
        use = "Foto de portada";
      }
      else if(media.media_use==='logo'){
        use = "Logo";
      }
      else if(media.media_use==='gallery_industry'){
        use = "Galería de empresa";
      }
      else if(media.media_use==='gallery_project'){
        use = "Galería de proyecto";
      }
      else if(media.media_use==='gallery_cast'){
        use = "Galería personal";
      }
      else{
        use = "Sin definir";
      }
    }
    return use;
  },
  imageDetails(){
    var image = Media.findOne({'mediaId' : Session.get("mediaId")});
    return image;
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
        use = "Foto de perfil";
      }
      else if(media.media_use==='cover'){
        use = "Foto de portada";
      }
      else if(media.media_use==='logo'){
        use = "Logo";
      }
      else if(media.media_use==='gallery_industry'){
        use = "Galería de empresa";
      }
      else if(media.media_use==='gallery_project'){
        use = "Galería de proyecto";
      }
      else if(media.media_use==='gallery_cast'){
        use = "Galería personal";
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
  'click #sendToEditor': function(event, template){
    event.preventDefault();
    //var mediaId = $(event.target).attr('data-id');
    var mediaId = Session.get("mediaId");
    console.log("Va a editar la imagen "+mediaId);
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    FlowRouter.go("/editMediaObject/"+mediaId+"/"+FlowRouter.getParam("from")+"/"+FlowRouter.getParam("returnTo")+"/"+FlowRouter.getParam("type"));  
    
  },
  'click #openImageDetails': function(event,template){
    event.preventDefault();
    var mediaId = $(event.target).attr('data-id');
    Session.set("mediaId",mediaId);
    $('#modal1').modal('show');
  },
  'change [type="text"]': function(event,template){
    var id = event.target.id;
    $("#message").html("Guardando...");
    if(id.indexOf("title")>=0){ //es el título
      id = id.substring(id.indexOf("title")+5,id.length);
      Meteor.call(
        'updateMediaTitle',
        Meteor.userId(),
        id,
        event.target.value
      );  
    }
    else if(id.indexOf("descr")>=0){ //es la descripción
      id = id.substring(id.indexOf("descr")+5,id.length);
      Meteor.call(
        'updateMediaDescription',
        Meteor.userId(),
        id,
        event.target.value
      );
    }
    $("#message").html("Datos actualizados"); 
    setTimeout(function(){
      $("#message").html(""); 
    }, 1500);    
  },
});