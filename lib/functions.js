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
}