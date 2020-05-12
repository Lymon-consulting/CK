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
            }
            else if(FlowRouter.getParam("type")==="cover"){
              Meteor.call(
              'updateCoverPicture',
              FlowRouter.getParam("returnTo"),
              public_id
              );
            }
            else if(FlowRouter.getParam("type")==="gallery_cast"){
              Meteor.call(
              'addGalleryCast',
              FlowRouter.getParam("returnTo"),
              public_id
              );
            }
            FlowRouter.go("/editProfileActor/"+Meteor.userId());
          }
          else if(FlowRouter.getParam("from")==="crew"){
            if(FlowRouter.getParam("type")==="profile"){
              Meteor.call(
              'updateProfilePicture',
              FlowRouter.getParam("returnTo"),
              public_id
              );
            }
            else if(FlowRouter.getParam("type")==="cover"){
              Meteor.call(
              'updateCoverPicture',
              FlowRouter.getParam("returnTo"),
              public_id
              );
            }
            FlowRouter.go("/editProfile/"+Meteor.userId());
          }
          else if(FlowRouter.getParam("from")==="industry"){
            if(FlowRouter.getParam("type")==="logo"){
              Meteor.call(
              'saveCompanyLogoID',
              FlowRouter.getParam("returnTo"),
              public_id
              );
            }
            else if(FlowRouter.getParam("type")==="cover"){
              Meteor.call(
              'saveCompanyCoverID',
              FlowRouter.getParam("returnTo"),
              public_id
              ); 
            }
            FlowRouter.go("/editIndustry/"+FlowRouter.getParam("returnTo"));
          }
          else if(FlowRouter.getParam("from")==="project"){
            if(FlowRouter.getParam("type")==="cover"){
              Meteor.call(
              'saveProjectPictureID',
              FlowRouter.getParam("returnTo"),
              public_id
              );
            }
            FlowRouter.go("/editProject/"+FlowRouter.getParam("returnTo"));
          }
        }
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
    var media = Media.find({'userId': Meteor.userId()});
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
    var mediaId = $(event.target).attr('data-id');
    console.log("Va a editar la imagen "+mediaId);
    if(FlowRouter.getParam("returnTo")!=null){
      FlowRouter.go("/editMediaObject/"+mediaId+"/"+FlowRouter.getParam("from")+"/"+FlowRouter.getParam("returnTo")+"/"+FlowRouter.getParam("type"));  
    }
    else{
      FlowRouter.go("/editMedia/"+mediaId+"/"+FlowRouter.getParam("from"));  
    }
    
  }
});