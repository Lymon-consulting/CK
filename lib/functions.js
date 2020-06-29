import { Params } from '/imports/api/params.js';
import { Media } from '/imports/api/media.js';

export const getParam = function(param_name) {
 
  Meteor.subscribe("params");
  var result=null;
  var params = Params.find().fetch();
  if(params!=null && params.length>0){
    result = eval("params[0]."+param_name);
  }
  return result;
};

export const getPicture = function(userId, size){
  var user = Meteor.users.findOne({'_id':userId});
  var url = "";
  if(user!=null){
    if(user.profilePictureID!=null){
      var picture = Media.findOne({'mediaId':user.profilePictureID});
      if(picture!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + picture.media_version + "/" + userId + "/" + user.profilePictureID;    
      }
    }
  }
  return url;
};

export const timeSince = function (date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " años";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " meses";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " días";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " horas";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutos";
  }
  return Math.floor(seconds) + " segundos";
};


export const trimInput = function (val){
  return val.replace(/^\s*|\s*$/g, "");
};

export const isNotEmpty = function (val){
  if(val && val!== ""){
    return true;
  }
};

export const formatURL = function (url){
  if(url!=""){
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;  
    }
  }
  return url;
};

export const uploadFiles = function (files, profileId) {
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
        var public_id = res.public_id;
        public_id = public_id.substring(public_id.indexOf("/")+1,public_id.length);
        
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

        Meteor.call(
            'updateMetaData',
            Meteor.userId(),
            public_id,
            res.bytes,
            res.width,
            res.height,
            res.version,
            res.url,
            null
          );
      }
      else{
        console.log("Upload Error:"  + err); //no output on console
      }
    });
  });
};