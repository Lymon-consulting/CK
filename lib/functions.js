import { Params } from '/imports/api/params.js';
import { Media } from '/imports/api/media.js';


export const hasTopRole = function(){
  var array = new Array();
  var result = false;
  var idFromDatabase, idFromSettingsDirector, idFromSettingsProductor;
  idFromSettingsDirector = parseInt(Meteor.settings.public.DIRECTOR_ID); 
  idFromSettingsProductor = parseInt(Meteor.settings.public.PRODUCTOR_ID); 
  if(Meteor.user()!=null && Meteor.user().role!=null){
    array = Meteor.user().role;
    for (var i = array.length - 1; i >= 0; i--) {
      idFromDatabase = parseInt(array[i]);

      if(idFromDatabase===idFromSettingsDirector || idFromDatabase===idFromSettingsProductor){//Director=32, Productor=72
        result = true;  
        break;
      }
    }
  }
  return result;
}

export const hasBusinessRole = function(){
  var array = new Array();
  var result = false;
  var idFromDatabase, idFromSettingsBusiness, idFromSettingsRepresentative;
  idFromSettingsBusiness = parseInt(Meteor.settings.public.BUSINESS_ID);
  idFromSettingsRepresentative = parseInt(Meteor.settings.public.REPRESENTATIVE_ID);
  if(Meteor.user()!=null && Meteor.user().role!=null){
    array = Meteor.user().role;
    for (var i = array.length - 1; i >= 0; i--) {
      idFromDatabase = parseInt(array[i]);
      if(idFromDatabase===idFromSettingsBusiness || idFromDatabase===idFromSettingsRepresentative){//BUSINESS_ID=3000, REPRESENTATIVE_ID=4000
        result = true;  
        break;
      }
    }
  }
  return result;
}


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

export const uploadFiles = function (files, ID, type) { //type=1 usuario, type=2 empresa, type=2 proyecto
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

    var level = Meteor.settings.public.LEVEL;
    
    $.cloudinary.config({
      cloud_name: Meteor.settings.public.CLOUD
    });

    var options;
    if(type==1){//perfil de persona
      options = {
        folder: level + "/people/"+ID
      };
    }
    else if(type==2){//perfil de empresa
      options = {
        folder: level + "/company/"+ID
      };
    }
    else if(type==3){//perfil de proyecto
      options = {
        folder: level + "/project/"+ID
      };
    }
    

    Cloudinary.upload(file, options, function(err,res){
      if(!err){
        var public_id = res.public_id;
        public_id = public_id.substring(public_id.indexOf("/")+1,public_id.length);
        
        Meteor.call(
          'saveMedia',
          type,
          ID,
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
            type,
            ID,
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