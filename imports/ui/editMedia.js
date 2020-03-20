import { Template } from 'meteor/templating';
import { Media } from '../api/media.js';

import './editMedia.html';

var cropper;
var image;
var params;
function wait(ms){
 var start = new Date().getTime();
 var end = start;
 while(end < start + ms) {
   end = new Date().getTime();
 }
}

Template.header.rendered = function(){
  $("#dragzone").css({
    "display": "none",
  });
};

Template.editMedia.onRendered(function () {

  if(FlowRouter.getParam('type')==='profile'){
    params = {
      'aspectRatio':1/1,
      'dragMode': 'none',        
      'autoCropArea': 0.8,
      'restore': false,
      'guides': true,
      'center': true,
      'movable': true,
      'highlight': false,
      'zoomable': true,
      'cropBoxMovable': true,
      'cropBoxResizable': false
    }
    
    
  }
  else if(FlowRouter.getParam('type')==='cover'){
    params = {
      'aspectRatio':2/1,
      'dragMode': 'none',        
      'autoCropArea': 0.8,
      'restore': false,
      'guides': true,
      'center': true,
      'movable': true,
      'highlight': false,
      'zoomable': true,
      'cropBoxMovable': true,
      'cropBoxResizable': false
    }
    
  }
  else if(FlowRouter.getParam('type')==='gallery'){
    params = {
      'aspectRatio':4/3,
      'dragMode': 'none',        
      'autoCropArea': 0.8,
      'restore': false,
      'guides': true,
      'center': true,
      'movable': true,
      'highlight': false,
      'zoomable': true,
      'cropBoxMovable': true,
      'cropBoxResizable': false
    }

    
  }
  
  image = document.getElementById('image');
  cropper = new Cropper(image, params);
  //cropper.setCropBoxData(params);

});


Template.editMedia.helpers({
  getMedia(){
    Meteor.subscribe("allMedia");
    var mediaId = FlowRouter.getParam('id');
    return Media.findOne({"mediaId":mediaId});
  },
  getURL(){
    Meteor.subscribe("allMedia");
    var mediaId = FlowRouter.getParam('id');
    var media = Media.findOne({'userId': Meteor.userId(), 'mediaId' : mediaId});
    return Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + Meteor.userId() + "/" + mediaId;
  },
  getTitle(){
    var title = "";
    if(FlowRouter.getParam("type")==='profile'){
      title = "Editar foto para perfil o logo de empresa";
    }
    else if(FlowRouter.getParam("type")==='cover'){
      title = "Editar foto para portada de perfil, de proyecto o de empresa";
    }
    else if(FlowRouter.getParam("type")==='gallery'){
      title = "Editar foto para galería de proyecto";
    }
    return title;

  }
});

Template.editMedia.events({
  'click #crop':function(event,template){
    event.preventDefault();

    var public_id = FlowRouter.getParam("id");
    var folder = Meteor.userId();

    cropper.getCroppedCanvas().toBlob((blob) => {

      $.cloudinary.config({
        cloud_name: Meteor.settings.public.CLOUD
      });

      var options = {
        folder: Meteor.userId(),
        public_id: public_id
      };

      Cloudinary.upload(blob, options, function(err,res){
        if(!err){
          console.log(res);
          /*
          console.log("Ya subió a coloudinary, ahora va a actualizar en el perfil del usuario con "+public_id);
          
          Meteor.call(
            'updateProfilePicture',
            Meteor.userId(),
            public_id
          );*/

          var composedId = folder+"/"+public_id;
          console.log("Ahora va a actualizar los meta datos de la imagen con "+composedId);
          

          Meteor.call(
            'updateMetaData',
            Meteor.userId(),
            public_id,
            res.bytes,
            res.width,
            res.height,
            res.version,
            res.url,
            FlowRouter.getParam("type")
          );

          FlowRouter.go("/mediaEditor/"+Meteor.userId());

        }
        else{
          console.log(err);
        }
      });
    });
  }
});