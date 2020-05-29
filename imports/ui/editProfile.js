import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';
import { getParam } from '/lib/functions.js';

import './editProfile.html';
import '/lib/common.js';

function trimInput(val){
  return val.replace(/^\s*|\s*$/g, "");
}

function isNotEmpty(val){
  if(val && val!== ""){
    return true;
  }
}
function formatURL(url){
  if(url!=""){
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;  
    }
  }
  return url;
}


Meteor.subscribe("fileUploads");
Meteor.subscribe("getOcupations");
Meteor.subscribe("getCategories");
Meteor.subscribe("getCountries");
Meteor.subscribe("userData");

Template.editProfile.rendered = function(){
  this.autorun(function(){

  });
}

Template.editProfile.helpers({
  userId() {
    return Meteor.userId();
  },
  name(){
   if(Meteor.user()){
    return Meteor.user().profile.name;
  }
},
lastname(){
 if(Meteor.user()){
  return Meteor.user().profile.lastname;
}
},
lastname2(){
 if(Meteor.user()){
  return Meteor.user().profile.lastname2;
}
},
resume(){
 if(Meteor.user() && Meteor.user().resume){
  var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
  $('#max').text(MAX_CHAR_IN_TEXTAREA - Meteor.user().resume.length);
  return Meteor.user().resume;
}
},
webpage(){
 if(Meteor.user()){
  return Meteor.user().webpage;
}
},
facebook(){
 if(Meteor.user()){
  return Meteor.user().facebook;
}
},
twitter(){
 if(Meteor.user()){
  return Meteor.user().twitter;
}
},
vimeo(){
 if(Meteor.user()){
  return Meteor.user().vimeo;
}
},
youtube(){
 if(Meteor.user()){
  return Meteor.user().youtube;
}
},
instagram(){
 if(Meteor.user()){
  return Meteor.user().instagram;
}
},
imdbCrew(){
 if(Meteor.user()){
  return Meteor.user().imdbCrew;
}
},
wizard(){
 return Meteor.user().wizard;
},
roleSelected: function(value){
  var result="";
  var prole = Meteor.user().role;
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
citySelected: function(value){
  var result="";
  var city = Meteor.user().city;
  if(city){
   var elem = city.indexOf(value);
   if(elem >= 0){
     result = 'selected';
   }
   else{
     result = "";
   } 
 }
 return result;
},
stateSelected: function(value){
  var result="";
  var state = Meteor.user().state;
  if(state){
   var elem = state.indexOf(value);
   if(elem >= 0){
     result = 'selected';
   }
   else{
     result = "";
   } 
 }
 return result;
},
countrySelected: function(value){
  var result="";
  var country = Meteor.user().country;
  if(country){
   var elem = country.indexOf(value);
   if(elem >= 0){
     result = 'selected';
   }
   else{
     result = "";
   } 
 }
 return result;
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
getRolesSelected(){
  var result = new Array();
  var userRoles = Meteor.user().role;
        //console.log(userRoles);
        if(userRoles){
          for (var i = 0; i < userRoles.length; i++) {
            if(userRoles[i]!="Productor" 
              && userRoles[i]!="Director" 
              && userRoles[i]!="Dueño" 
              && userRoles[i]!="Legal" 
              && userRoles[i]!="Ejecutivo"){
              result.push(userRoles[i]);
          }
        }
      }
      return result;
    },
    hasPrimaryRole(){
      var result = false;
      if(Meteor.user().role){
        result = true;
      }
      return result;
    },
    getPrimaryRoles(){
      var result = new Array();
      var userRoles = Meteor.user().role;
      var strResult = "";
      if(userRoles){
        for (var i = 0; i < userRoles.length; i++) {
          if(userRoles[i]==="Productor"){
            result.push(userRoles[i]);
          }
          else if(userRoles[i]==="Director"){
            result.push(userRoles[i]);
          }
          else if(userRoles[i]==="Dueño"){
            result.push(userRoles[i]);
          }
          else if(userRoles[i]==="Legal"){
            result.push("Representante legal");
          }
          else if(userRoles[i]==="Ejecutivo"){
            result.push("Administrador de industria");
          }
        }

        for (var i = 0; i < result.length; i++) {
          strResult = strResult + ", " + result[i];
        }
        strResult = strResult.substring(2, strResult.length);
      }
        //console.log(result);
        return strResult;
      },
      getCountries(){
       var data = City.find().fetch();
       return _.uniq(data, false, function(transaction) {return transaction.country});
     },
     getStatesFromCountries(){
      var country;
      if(Session.get("selected_country")!=null){
        country = City.find({'country': Session.get("selected_country")}).fetch();
        return _.uniq(country, false, function(transaction) {return transaction.state});
      }
      else{
       country = City.find({'country': 'México'}).fetch(); 
       return _.uniq(country, false, function(transaction) {return transaction.state});
     }

   },
   getCitiesFromStates(){
    if(Session.get("selected_state")!=null){
      return City.find({'state': Session.get("selected_state")}).fetch();
    }
    else{
      if(Meteor.user().state){
        return City.find({'state': Meteor.user().state}).fetch();    
      }
      else{
        return City.find({'state': 'Aguascalientes'}).fetch();    
      }
    }

  },
  getProfilePicture() {

   if(Meteor.user().profilePictureID!=null){
    var profile = Media.findOne({'mediaId':Meteor.user().profilePictureID});
    if(profile!=null){
      return getParam("CLOUDINARY_RES_URL") + "/w_80,h_80,c_thumb,f_auto,r_max/" + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().profilePictureID;    
    }

  }
},
getInitials(){
  var name = Meteor.user().profile.name;
  var lastname = Meteor.user().profile.lastname;
  var initials = name.charAt(0) + lastname.charAt(0);
  return initials;
},
getCoverPicture() {
  if(Meteor.user().profileCoverID!=null){
    var profile = Media.findOne({'mediaId':Meteor.user().profileCoverID});
    if(profile!=null){
      return getParam("CLOUDINARY_RES_URL") + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().profileCoverID;    
    }

  }
  
},
getPublicID(type){
  if(type==='profile'){
    return Meteor.user().profilePictureID;
  }
  else if(type==='cover'){
    return Meteor.user().profileCoverID;  
  }
  
},
hasMedia() {
  Meteor.subscribe("allMedia");
  //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
  var media = Media.find({'userId': Meteor.userId()}).count();
  var hasMedia = false;
  if(media > 0){
    hasMedia = true;
  }
  return hasMedia;
},
getMedia() {
  Meteor.subscribe("allMedia");
  //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
  var media = Media.find({'userId': Meteor.userId()},{sort:{'media_date':-1}});
  return media;
},
getURL(mediaId){
  var url = "";
  url = getParam("CLOUDINARY_RES_URL") + "/" + mediaId;
  return url;
},
showCreateCastLink(){
    var result = true;
    if(Meteor.user()){
      if(Meteor.user().isCast!=null && Meteor.user().isCast){
        result=false;
        /*
        if(Meteor.user().profileType==="cast"){ //si ya es cast ya no mostrar el link
          result = false;
        }
        else if(Meteor.user().profileType==="both"){ //si es tanto cast como crew ya no mostrar el link
          result = false; 
        }
        else{
          result = true;
        }*/

      }
    }
    return result;
  },
  maxLength(){
    return getParam("MAX_CHAR_IN_TEXTAREA");
  }



});

Template.editProfile.events({

  'change #personName': function(event,template){
    var name = trimInput(event.target.value);
    console.log(name);
    if(isNotEmpty(name)){
      Meteor.call('updateName', Meteor.userId(), name);
      var lastname = trimInput($('#personLastName').val());
      var lastname2 = trimInput($('#personLastName2').val());
      var fullname = name + " " + lastname + " " + lastname2;
      Meteor.call('updateFullName', Meteor.userId(), fullname);
    }
  },
  'change #personLastName': function(event,template){
    var personLastName = trimInput(event.target.value);
    console.log(personLastName);
    if(isNotEmpty(personLastName)){
      Meteor.call('updateLastName', Meteor.userId(), personLastName);
      var name = trimInput($('#personName').val());
      var lastname2 = trimInput($('#personLastName2').val());
      var fullname = name + " " + personLastName + " " + lastname2;
      Meteor.call('updateFullName', Meteor.userId(), fullname);
    }
  },
  'change #personLastName2': function(event,template){
    var personLastName2 = trimInput(event.target.value);
    console.log(personLastName2);
    Meteor.call('updateLastName2', Meteor.userId(), personLastName2);
    var name = trimInput($('#personName').val());
    var lastname = trimInput($('#personLastName').val());
    var fullname = name + " " + lastname + " " + personLastName2;
    Meteor.call('updateFullName', Meteor.userId(), fullname);
  },
  'change #resume': function(event,template){
    var resume = trimInput(event.target.value);
    Meteor.call('updateResume', Meteor.userId(), resume);
  },
  'change #country': function(event,template){
    var country = trimInput(event.target.value);
    Meteor.call('updateCountry', Meteor.userId(), country);
    Session.set("selected_country", event.target.value);
  },
  'change #states': function(event,template){
    var state = trimInput(event.target.value);
    Meteor.call('updateState', Meteor.userId(), state);
    Meteor.call('updateCountry', Meteor.userId(), "México");
    Session.set("selected_state", state);
    var firstCity = City.findOne({'state': state}).city;
    Meteor.call('updateCity', Meteor.userId(), firstCity);  
  },
  'change #city': function(event,template){
    var city = trimInput(event.target.value);
    Meteor.call('updateCity', Meteor.userId(), city);
    Meteor.call('updateCountry', Meteor.userId(), "México");
  },
  'change #web_page': function(event,template){
    var web_page = trimInput(event.target.value);
    Meteor.call('updateWebPage', Meteor.userId(), web_page);
  },
  'change #facebook_page': function(event,template){
    var facebook_page = trimInput(event.target.value);
    Meteor.call('updateFacebookPage', Meteor.userId(), facebook_page);
  },
  'change #twitter_page': function(event,template){
    var twitter_page = trimInput(event.target.value);
    Meteor.call('updateTwitterPage', Meteor.userId(), twitter_page);
  },
  'change #vimeo_page': function(event,template){
    var vimeo_page = trimInput(event.target.value);
    Meteor.call('updateVimeoPage', Meteor.userId(), vimeo_page);
  },
  'change #youtube_page': function(event,template){
    var youtube_page = trimInput(event.target.value);
    Meteor.call('updateYoutubePage', Meteor.userId(), youtube_page);
  },
  'change #instagram_page': function(event,template){
    var instagram_page = trimInput(event.target.value);
    Meteor.call('updateInstagramPage', Meteor.userId(), instagram_page);
  },
  'change #imdb_page': function(event,template){
    var imdb_page = trimInput(event.target.value);
    Meteor.call('updateIMDBPage', Meteor.userId(), imdb_page);
  },
  'change #video': function(event,template){
    event.preventDefault();
    var video = trimInput(event.target.value);
    if(isNotEmpty(video)){
      if(video.indexOf("vimeo")>0){
        Meteor.call('updateVimeoPageCrew', Meteor.userId(), formatURL(video)); 
        Meteor.call('updateYoutubePageCrew', Meteor.userId(), null); 
      } 
      else if(video.indexOf("youtube")>0){
        Meteor.call('updateYoutubePageCrew', Meteor.userId(), formatURL(video)); 
        Meteor.call('updateVimeoPageCrew', Meteor.userId(), null); 
      }
      else{
        Bert.alert({message: 'Por el momento únicamente aceptamos videos de vimeo o youtube', type: 'danger', icon: 'fa fa-exclamation'});
      }
      
    }
    else{
      Meteor.call('updateYoutubePageCrew', Meteor.userId(), null); 
      Meteor.call('updateVimeoPageCrew', Meteor.userId(), null); 
    }
  },

  'click #goProfile': function(event, template){
   event.preventDefault();
   

    //Bert.alert({message: 'Se ha actualizado tu perfil', type: 'success', icon: 'fa fa-check'});
    FlowRouter.go('/profilePage/' + Meteor.userId());
  //}
  //return false
},

'click .goMediaLibraryProfile': function(event,template){
  event.preventDefault();
  $('#modal1').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
  //FlowRouter.go("/mediaEditor/" + Meteor.userId()+"/crew/profile");
  FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+ "/crew/" + Meteor.userId() + "/profile");
},
'click .goMediaLibraryCover': function(event,template){
  event.preventDefault();
  $('#modal1').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
  //FlowRouter.go("/mediaEditor/" + Meteor.userId()+"/crew/cover");
  FlowRouter.go("/mediaEditorObject/" + Meteor.userId() + "/crew/" + Meteor.userId() + "/cover");
},
'click #openMediaGallery': function(event,template){
  event.preventDefault();
  $(".media-thumb").css('border','none');
  $("#setProfilePicture").addClass('disabled');
  $('#modal1').modal('show');
},
'click #openMediaCover': function(event,template){
  event.preventDefault();
  $(".media-thumb").css('border','none');
  $("#setCoverPicture").addClass('disabled');
  $('#modal2').modal('show');
},

'click #selectProfilePicture': function(event,template){
  event.preventDefault();
  var mediaId = $(event.currentTarget).attr("data-id");

  Session.set("mediaId",mediaId);

 $(".media-thumb").css('border','none');
 $(event.target).css('border', "solid 3px blue");
 $("#setProfilePicture").removeClass('disabled');

},
'click #setProfilePicture': function(event,template){
 event.preventDefault();
 var mediaId = Session.get("mediaId");

 Meteor.call(
  'updateProfilePicture',
  Meteor.userId(),
  mediaId
  );

  $('#modal1').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();

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
  'updateCoverPicture',
  Meteor.userId(),
  mediaId
  );

  $('#modal2').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
  $("#setCoverPicture").removeClass('disabled');

},

'keyup #resume' : function(event){
 event.preventDefault();

 var len = $('#resume').val().length;
 if(len > getParam("MAX_CHAR_IN_TEXTAREA")){
  val.value= val.value.substring(0,getParam("MAX_CHAR_IN_TEXTAREA"));
}
else{
  $('#max').text(getParam("MAX_CHAR_IN_TEXTAREA")-len);
}
},

'click #deleteFileButton ': function (event) {
 event.preventDefault();
 if(confirm("Se va a eliminar esta imagen de portada ¿estás seguro?")){
           //console.log("deleteFile button ", this);
           //PersonalCover.remove({_id:this._id});
           var public_id = $(event.target).attr('data-id');
           console.log("Borrando "+ public_id);
           console.log(Cloudinary);
           Cloudinary.delete(public_id,function(res){
             console.log(res);
           });
           Meteor.call(
            'deleteCover',
            Meteor.userId(),
            public_id
            );
         }
       },
       'click .closeModal ': function (event){
        event.preventDefault();
        $('#myModal').hide();
      },
      'click #hideWizard' : function(event){
        event.preventDefault();
        
        Meteor.call('hideWizard');

        $('#myModal').hide();
      },
      
      'change #category':function(event, template){
       event.preventDefault();
       Session.set("selected_category", event.currentTarget.value);
     },
     'dblclick #ocupation':function(event, template){
       event.preventDefault();
       Meteor.call(
        'addRole',
        Meteor.userId(),
        event.currentTarget.value
        );
     },
     'dblclick #selection':function(event, template){
       event.preventDefault();
       Meteor.call(
        'removeRole',
        Meteor.userId(),
        event.currentTarget.value
        );
     },
     'change #file-upload': function(event, template){
      var file = event.target.files[0];

      $.cloudinary.config({
        cloud_name:"drhowtsxb"
      });

      var options = {
        folder: Meteor.userId()
      };

      Cloudinary.upload(file, options, function(err,res){
        if(!err){
          Meteor.call(
            'saveProfilePictureID',
            Meteor.userId(),
            res.public_id
            );
        }
        else{
            console.log("Upload Error:"  + err); //no output on console
          }
        });
    },
    'change #cover-upload': function(event, template){
      var file = event.target.files[0];

      $.cloudinary.config({
        cloud_name:"drhowtsxb"
      });

      var options = {
        folder: Meteor.userId()
      };

      Cloudinary.upload(file, options, function(err,res){
        if(!err){
          Meteor.call(
            'saveProfileCoverID',
            Meteor.userId(),
            res.public_id
            );
        }
        else{
            console.log("Upload Error:"  + err); //no output on console
          }
        });
    },
    'click #addCastProfile':function(event, template){
      event.preventDefault();

      //Meteor.call('updateProfileType', Meteor.userId(),"both");
      Meteor.call('setIsCast', Meteor.userId(),true);
      

      $('#castModal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      Session.set("viewAs","cast");
      window.scrollTo(0, 0);
      FlowRouter.go("/editProfileActor/" + Meteor.userId());
    }
    
  });



