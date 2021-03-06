import { Template } from 'meteor/templating';
import { Media } from '../api/media.js';
import { Project } from '../api/project.js';
import { Industry } from '../api/industry.js';

import './editMedia.html';

var cropper;
var image;
var params;


Template.editMedia.rendered = function(){
  this.autorun(function(){
    image = document.getElementById('image');
    params = {
          'dragMode': 'none',        
          'autoCropArea': 0.8,
          'restore': false,
          'guides': true,
          'center': true,
          'movable': true,
          'highlight': false,
          'zoomable': true,
          'cropBoxMovable': true,
          'cropBoxResizable': true
        }
   
  });
}

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

Template.editMedia.events({
  'click #crop':function(event,template){
    event.preventDefault();

    var public_id = Session.get("mediaId");
    var folder = Meteor.userId();

    cropper.getCroppedCanvas().toBlob((blob) => {

      $.cloudinary.config({
        cloud_name: Meteor.settings.public.CLOUD
      });

      /*Para cambiar la imagen original descomentar esto*/
      /*
      var options = {
        folder: Meteor.userId(),
        public_id: public_id
      };
      */

      /*Para crear una nueva imagen a partir de la original*/
      var options = {
        folder: Meteor.userId()
      };

      Cloudinary.upload(blob, options, function(err,res){
        if(!err){
          //console.log(res);
      
          //var composedId = folder+"/"+public_id;
          //console.log("Ahora va a actualizar los meta datos de la imagen con "+composedId);

          //var type = $("#type").children("option:selected").val();
          //console.log("Cambiando el tipo a "+type);

          /*
          Meteor.call(
            'updateMetaData',
            Meteor.userId(),
            res.public_id,
            res.bytes,
            res.width,
            res.height,
            res.version,
            res.url,
            null
          );*/
          var public_id = res.public_id;
          public_id = public_id.substring(public_id.indexOf("/")+1,public_id.length);

          Meteor.call(
            'saveMedia',
            Meteor.userId(),
            public_id,
            blob.size,
            blob.type,
            blob.name,
            res.width,
            res.height,
            res.version,
            res.url
          );

          Bert.alert({message: 'Se ha creado una nueva imagen a partir de la original' , type: 'success', icon: 'fa fa-check'});

          cropper.destroy();

          FlowRouter.go("/mediaEditorObject/"+Meteor.userId()+"/"+FlowRouter.getParam("from")+"/"+FlowRouter.getParam("returnTo")+"/"+FlowRouter.getParam("type"));

        }
        else{
          console.log(err);
        }
      });
    });
  },
  'change #type': function(event, template){
    event.preventDefault();
    var type = event.target.value;
    console.log(type);
    if(cropper){
      cropper.destroy();
    }
    
    if(type==="profile" || type==="logo"){
      params.aspectRatio = 1/1;
      cropper = new Cropper(image, params);
      $("#crop").removeAttr('disabled');
    }
    else if(type==="cover"){
      params.aspectRatio = 2/1;
      cropper = new Cropper(image, params);
      $("#crop").removeAttr('disabled');
    }
    else if(type==="gallery_industry" || type==="gallery_project" || type==="gallery_cast"){
      params.aspectRatio = 4/3;
      cropper = new Cropper(image, params);
      $("#crop").removeAttr('disabled');
    }
    else if(type==="poster"){
      console.log("Aqui");
      params.aspectRatio = 3/4;
      cropper = new Cropper(image, params);
      $("#crop").removeAttr('disabled');
    }
    else{
      console.log("ninguno");
      if(cropper){
        cropper.destroy();
      }
      $("#crop").prop('disabled', true);
    }

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
  
  
  'click .delete' : function(event,template){
    if(confirm("Si la imagen se usa en alguno de tus proyectos, empresas o perfil será removida de ellos ¿Desea continuar con la eliminación?")){
      var public_id = $(event.currentTarget).attr("data-id");

      /*Borrando el id de la imagen de los proyectos*/
      var projectsUsingThisImage = Project.find({'projectPictureID':public_id});
      projectsUsingThisImage.forEach(function(project){
          Meteor.call('saveProjectPictureID',
            project._id,
            null
          );
      });

      /*Borrando el id de la imagen de las industrias que lo usan como logo*/
      var companiesUsingThisImageAsLogo = Industry.find({'companyLogoID':public_id});
      companiesUsingThisImageAsLogo.forEach(function(company){
          Meteor.call('saveCompanyLogoID',
            project._id,
            null
          );
      });

      /*Borrando el id de la imagen de las industrias que lo usan como portada*/
      var companiesUsingThisImageAsCover = Industry.find({'companyCoverID':public_id});
      companiesUsingThisImageAsCover.forEach(function(company){
          Meteor.call('saveCompanyCoverID',
            project._id,
            null
          );
      });

      /*Borrando el id de la imagen de los usuarios que lo usan como foto de perfil*/
      var usersUsingThisImageAsProfile = Meteor.users.find({'profilePictureID':public_id});
      usersUsingThisImageAsProfile.forEach(function(user){
        Meteor.call('updateProfilePicture',
          user._id,
          public_id
        );
      });

      /*Borrando el id de la imagen de los usuarios que lo usan como portada*/
      var usersUsingThisImageAsCover = Meteor.users.find({'profileCoverID':public_id});
      usersUsingThisImageAsCover.forEach(function(user){
        Meteor.call('updateCoverPicture',
          user._id,
          public_id
        );
      });

      /*Falta agregar el borrado de las galerías de proyectos*/

      
      /*Borrando la imagen de la biblioteca de imágenes*/
      Meteor.call(
        'deleteMedia',
        Meteor.userId(),
        public_id, function(error,result){
          /*Borrando la imagen de cloudinary*/
          //console.log("Borrando de cloudinary "+ public_id);
          var cloud_id = Meteor.userId() + "/" + public_id;
          
          Cloudinary.delete(cloud_id,function(res){
            //console.log(res);
          });    
        }
      );
    
    }
    FlowRouter.go("/mediaEditorObject/"+Meteor.userId()+"/"+FlowRouter.getParam("from")+"/"+FlowRouter.getParam("returnTo")+"/"+FlowRouter.getParam("type"));
  },
  'click #goBack':function(e,t){
    e.preventDefault();
    FlowRouter.go("/mediaEditorObject/"+Meteor.userId()+"/"+FlowRouter.getParam("from")+"/"+FlowRouter.getParam("returnTo")+"/"+FlowRouter.getParam("type"));
  },
  'click #setProfileCrop': function(e,t){
    if(cropper){
      cropper.destroy();
    }
    params.aspectRatio = 1/1;
    cropper = new Cropper(image, params);
    $("#crop").removeAttr('disabled');
    
    //$('#modal1').modal('hide');
    //$('body').removeClass('modal-open');
    //$('.modal-backdrop').remove();
  },
  'click #setCoverCrop': function(e,t){
    if(cropper){
      cropper.destroy();
    }
    params.aspectRatio = 2/1;
    cropper = new Cropper(image, params);
    $("#crop").removeAttr('disabled');
    //$('#modal1').modal('hide');
    //$('body').removeClass('modal-open');
    //$('.modal-backdrop').remove();
  },
  'click #setGalleryCrop': function(e,t){
    if(cropper){
      cropper.destroy();
    }
    params.aspectRatio = 4/3;
    cropper = new Cropper(image, params);
    $("#crop").removeAttr('disabled');
    //$('#modal1').modal('hide');
    //$('body').removeClass('modal-open');
    //$('.modal-backdrop').remove();
  },
  'click #setPosterCrop': function(e,t){
    if(cropper){
      cropper.destroy();
    }
    params.aspectRatio = 3/4;
    cropper = new Cropper(image, params);
    $("#crop").removeAttr('disabled');
    //$('#modal1').modal('hide');
    //$('body').removeClass('modal-open');
    //$('.modal-backdrop').remove();
  }
});