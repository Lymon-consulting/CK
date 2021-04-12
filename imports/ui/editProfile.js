import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';
import { getParam } from '/lib/functions.js';
import { uploadFiles } from '/lib/functions.js';
import { trimInput } from '/lib/functions.js';
import { isNotEmpty } from '/lib/functions.js';
import { formatURL } from '/lib/functions.js';
import { getCrewCategories } from '/lib/globals.js';
import { catTopCategories } from '/lib/globals.js';
import { getCrewRoleFromCategory } from '/lib/globals.js';
import { getRoleById } from '/lib/globals.js';
import { catHeights, catAges, catPhysical, catEthnics, catEyes, catHair, catHairType, catLanguages, catCategories } from '/lib/globals.js';



import './editProfile.html';
import '/lib/common.js';

Meteor.subscribe("fileUploads");
Meteor.subscribe("getOcupations");
Meteor.subscribe("getCategories");
Meteor.subscribe("getCountries");
Meteor.subscribe("userData");
Meteor.subscribe("otherUsers");

Template.editProfile.rendered = function(){
  this.autorun(function(){
    //console.log(getRoleById(32));
    //console.log(getRoleById(32).roleName);
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
 if(Meteor.user() && Meteor.user().crew!=null && Meteor.user().crew.resume){
  var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
  $('#max').text(MAX_CHAR_IN_TEXTAREA - Meteor.user().crew.resume.length);
  return Meteor.user().crew.resume;
}
},
resumeCast(){
 if(Meteor.user() && Meteor.user().cast!=null && Meteor.user().cast.resume){
  var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
  $('#maxCast').text(MAX_CHAR_IN_TEXTAREA - Meteor.user().cast.resume.length);
  return Meteor.user().cast.resume;
}
},
webpage(){
 if(Meteor.user()!=null && Meteor.user().crew!=null){
  return Meteor.user().crew.webpage;
}
},
facebook(){
 if(Meteor.user()!=null && Meteor.user().crew!=null){
  return Meteor.user().crew.facebook;
}
},
facebook_cast(){
 if(Meteor.user()!=null && Meteor.user().cast!=null){
  return Meteor.user().cast.facebook;
}
},
twitter(){
 if(Meteor.user()!=null && Meteor.user().crew!=null){
  return Meteor.user().crew.twitter;
}
},
twitter_cast(){
 if(Meteor.user()!=null && Meteor.user().cast!=null){
  return Meteor.user().cast.twitter;
}
},
vimeo(){
 if(Meteor.user()!=null && Meteor.user().crew!=null){
  return Meteor.user().crew.vimeo;
}
},
vimeo_cast(){
 if(Meteor.user()!=null && Meteor.user().cast!=null){
  return Meteor.user().cast.vimeo;
}
},

youtube(){
 if(Meteor.user()!=null && Meteor.user().crew!=null){
  return Meteor.user().crew.youtube;
}
},
youtube_cast(){
 if(Meteor.user()!=null && Meteor.user().cast!=null){
  return Meteor.user().cast.youtube;
}
},
instagram(){
 if(Meteor.user()!=null && Meteor.user().crew!=null){
  return Meteor.user().crew.instagram;
}
},
instagram_cast(){
 if(Meteor.user()!=null && Meteor.user().cast!=null){
  return Meteor.user().cast.instagram;
}
},

imdbCrew(){
 if(Meteor.user()!=null && Meteor.user().crew!=null){
  return Meteor.user().crew.imdb;
}
},
imdb_cast(){
 if(Meteor.user()!=null && Meteor.user().cast!=null){
  return Meteor.user().cast.imdb;
}
},

  video(){
    var video = "";
    if(Meteor.user()!=null){
      if(Meteor.user().crew!=null && Meteor.user().crew.vimeo!=null){
        video = Meteor.user().crew.vimeo;
      }
      else if(Meteor.user().crew!=null && Meteor.user().crew.youtube!=null){
        video = Meteor.user().crew.youtube;
      } 
    }
    return video;
  },
  web_cast(){
    if(Meteor.user()!=null && Meteor.user().cast!=null){
      return Meteor.user().cast.webpage;
    }
  },
  video_cast(){
    var video = "";
    if(Meteor.user()!=null){
      if(Meteor.user().cast!=null && Meteor.user().cast.vimeo_demo!=null){
        video = Meteor.user().cast.vimeo_demo;
      }
      else if(Meteor.user().cast!=null && Meteor.user().cast.youtube_demo!=null){
        video = Meteor.user().cast.youtube_demo;
      } 
    }
    return video;
  },
  categories(){
    return catTopCategories; //variable global en globals.js
  },
  checkCategory:function(item){
    var result="";
    var category = new Array() ;
    if(Meteor.user() && Meteor.user().role){
      category = Meteor.user().role;
      if(category!=null && category.indexOf(item)>=0){
        result = "checked";
      }
    }
   return result;
  },
/*
wizard(){
 return Meteor.user().wizard;
},*/
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

  var values = getCrewCategories();
  //console.log(values);
  return values;
  /*
 var data = Ocupation.find({},{sort:{'title':1}}).fetch();
 return _.uniq(data, false, function(transaction) {return transaction.title});*/
},
getOcupationsFromCategory(){
 var object = new Array();
 if(Session.get("selected_category")!=null){
  object = getCrewRoleFromCategory(Session.get("selected_category"));
//  console.log(object);

  //return Ocupation.find({'title': Session.get("selected_category")}).fetch();
}
else{
  object = getCrewRoleFromCategory("Animación y arte digital");
  //return Ocupation.find({'title': "Animacion y arte digital"}).fetch();
}
return object;
},
getRolesSelected(){  

  var result = new Array();
  var userRoles = Meteor.user().role;
  //console.log(userRoles);
  if(userRoles){
    for (var i = 0; i < userRoles.length; i++) {
      //console.log("Con "+userRoles[i]);
      //console.log(getRoleById(parseInt(userRoles[i])).roleName);
      result.push(getRoleById(userRoles[i]));
    }
  }
  //console.log(result);
  return result;
},

    hasPrimaryRole(){
      var result = false;
      if(Meteor.user().topRole){
        result = true;
      }
      return result;
    },
    getPrimaryRoles(){
      var result = new Array();
      var userRoles = Meteor.user().topRole;
      var strResult = "";
      if(userRoles){
        for (var i = 0; i < userRoles.length; i++) {
          if(userRoles[i]==="1"){
            result.push("Producción");
          }
          else if(userRoles[i]==="2"){
            result.push("Dirección");
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
/*
   if(Meteor.user()!=null && Meteor.user().crew!=null && Meteor.user().crew.profilePictureID!=null){
      var profile = Media.findOne({'mediaId':Meteor.user().crew.profilePictureID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_80,h_80,c_thumb,f_auto,r_max/" + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().crew.profilePictureID;    
      }

    }*/
},
getInitials(){
  var name = Meteor.user().profile.name;
  var lastname = Meteor.user().profile.lastname;
  var initials = name.charAt(0) + lastname.charAt(0);
  return initials;
},
getCoverPicture() {
  if(Meteor.user()!=null && Meteor.user().crew !=null){
    if(Meteor.user().crew.profileCoverID!=null){
      var profile = Media.findOne({'mediaId':Meteor.user().crew.profileCoverID});
      if(profile!=null){
        return getParam("CLOUDINARY_RES_URL") + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().crew.profileCoverID;    
      }

    }
  }
  
},
getPublicID(type){
  if(type==='profile'){
    return Meteor.user().crew.profilePictureID;
  }
  else if(type==='cover'){
    return Meteor.user().crew.profileCoverID;  
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
      }
    }
    return result;
  },
  isCastChecked(){
    var result = "";
    if(Meteor.user()){
      if(Meteor.user().isCast!=null && Meteor.user().isCast){
        result="checked";
      }
    }
    return result;
  },
  isCrewChecked(){
    var result = "";
    if(Meteor.user()){
      if(Meteor.user().isCrew!=null && Meteor.user().isCrew){
        result="checked";
        $('#category').prop('disabled', false);
        $('#ocupation').prop('disabled', false);
        $('#selection').prop('disabled', false);
        $('#web_page').prop('disabled', false);
        $('#video').prop('disabled', false);
        $('#facebook_page').prop('disabled', false);
        $('#twitter_page').prop('disabled', false);
        $('#vimeo_page').prop('disabled', false);
        $('#youtube_page').prop('disabled', false);
        $('#instagram_page').prop('disabled', false);
        $('#imdb_page').prop('disabled', false);
      }
    }
    return result;
  },
  maxLength(){
    return getParam("MAX_CHAR_IN_TEXTAREA");
  },
  maxCastLength(){
    return getParam("MAX_CHAR_IN_TEXTAREA");
  },

 /*Métodos para cast*/
 selectedGender(radioVal){
    var result = "";
    Meteor.subscribe("otherUsers");
    var userSelection = Meteor.user().cast.sex; 
    if(userSelection==='Masculino' && radioVal==='Masculino'){ 
      result = "checked";
    }
    else if(userSelection==='Femenino' && radioVal==='Femenino'){
      result = "checked";
    }
    else if(userSelection==='Sin definir' && radioVal==='Sin definir'){
      result = "checked";
    }
    return result;
  },
  ageSelected: function(item){
    var result="";
    var age = Meteor.user().cast.ageRange;
    //console.log(height);
    if(age){
     var elem = age.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  heightSelected: function(item){
    var result="";
    var height = Meteor.user().cast.height;
    //console.log(height);
    if(height){
     var elem = height.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  physicalSelected: function(item){
    var result="";
    var physical = Meteor.user().cast.physical;
    //console.log(height);
    if(physical){
     var elem = physical.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  ethnicsSelected:function(item){
    var result="";
    var ethnics = Meteor.user().cast.ethnicity;
    //console.log(height);
    if(ethnics){
     var elem = ethnics.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  eyesSelected:function(item){
    var result="";
    var eyes = Meteor.user().cast.eyes;
    //console.log(height);
    if(eyes){
     var elem = eyes.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  hairSelected:function(item){
    var result="";
    var hair = Meteor.user().cast.hair;
    //console.log(height);
    if(hair){
     var elem = hair.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  hairTypeSelected:function(item){
    var result="";
    var hairType = Meteor.user().cast.hairType;
    //console.log(height);
    if(hairType){
     var elem = hairType.indexOf(item);
     if(elem >= 0){
       result = 'selected';
     }
     else{
       result = "";
     } 
   }
   return result;
  },
  checkLanguage:function(item){
    var result="";
    var language = new Array() ;
    if(Meteor.user() && Meteor.user().cast.languages){
      language = Meteor.user().cast.languages;
      if(language!=null && language.indexOf(item)>=0){
        result = "checked";
      }
    }
   return result;
  },
  ages(){
    return catAges; //variable global en globals.js
  },
  heights(){
    return catHeights; //variable global en globals.js
  },
  physical(){
    return catPhysical; //variable global en globals.js
  },
  ethnics(){
    return catEthnics; //variable global en globals.js
  },
  eyes(){
    return catEyes; //variable global en globals.js
  },
  hair(){
    return catHair; //variable global en globals.js
  },
  hairType(){
    return catHairType; //variable global en globals.js
  },
  languages(){
    return catLanguages; //variable global en globals.js
  },
  peculiarities(){
    var data = Meteor.user();
    var resume="";
    var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
    if(data!=null && data.cast.peculiarities!=null){
      resume = data.cast.peculiarities;
      $('#max-peculiarities').text(MAX_CHAR_IN_TEXTAREA - resume.length);
    }
    else{
      $('#max-peculiarities').text(MAX_CHAR_IN_TEXTAREA); 
    }
    return resume;
  },
  skills(){
   var data = Meteor.user();
    var resume="";
    var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
    if(data!=null && data.cast.skills!=null){
      resume = data.cast.skills;
      $('#max-skills').text(MAX_CHAR_IN_TEXTAREA - resume.length);
    }
    else{
      $('#max-skills').text(MAX_CHAR_IN_TEXTAREA); 
    }
    return resume;
  },

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
    Meteor.call('updateCrewResume', Meteor.userId(), resume);
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
    Meteor.call('updateCrewWebPage', Meteor.userId(), web_page);
  },
  'change #facebook_page': function(event,template){
    var facebook_page = trimInput(event.target.value);
    Meteor.call('updateCrewFacebookPage', Meteor.userId(), facebook_page);
  },
  'change #twitter_page': function(event,template){
    var twitter_page = trimInput(event.target.value);
    Meteor.call('updateCrewTwitterPage', Meteor.userId(), twitter_page);
  },
  'change #vimeo_page': function(event,template){
    var vimeo_page = trimInput(event.target.value);
    Meteor.call('updateCrewVimeoPage', Meteor.userId(), vimeo_page);
  },
  'change #youtube_page': function(event,template){
    var youtube_page = trimInput(event.target.value);
    Meteor.call('updateCrewYoutubePage', Meteor.userId(), youtube_page);
  },
  'change #instagram_page': function(event,template){
    var instagram_page = trimInput(event.target.value);
    Meteor.call('updateCrewInstagramPage', Meteor.userId(), instagram_page);
  },
  'change #imdb_page': function(event,template){
    var imdb_page = trimInput(event.target.value);
    Meteor.call('updateCrewIMDBPage', Meteor.userId(), imdb_page);
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
 $(event.target).css('border', "solid 3px #ED1567");
 $("#setProfilePicture").removeClass('disabled');

},
'click #setProfilePicture': function(event,template){
 event.preventDefault();
 var mediaId = Session.get("mediaId");

 Meteor.call(
  'updateCrewProfilePicture',
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
 $(event.target).css('border', "solid 3px #ED1567");
 $("#setCoverPicture").removeClass('disabled');

},
'click #setCoverPicture': function(event,template){
 event.preventDefault();
 var mediaId = Session.get("mediaId");

 Meteor.call(
  'updateCrewCoverPicture',
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
'keyup #resumeCast' : function(event){
 event.preventDefault();

 var len = $('#resumeCast').val().length;
 if(len > getParam("MAX_CHAR_IN_TEXTAREA")){
  val.value= val.value.substring(0,getParam("MAX_CHAR_IN_TEXTAREA"));
}
else{
  $('#maxCast').text(getParam("MAX_CHAR_IN_TEXTAREA")-len);
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
            'deleteCrewCover',
            Meteor.userId(),
            public_id
            );
         }
       },
       'click .closeModal ': function (event){
        event.preventDefault();
        $('#myModal').hide();
      },/*
      'click #hideWizard' : function(event){
        event.preventDefault();
        
        Meteor.call('hideWizard');

        $('#myModal').hide();
      },*/
      
      'change #category':function(event, template){
       event.preventDefault();
       Session.set("selected_category", event.currentTarget.value);
     },
     'click #ocupation':function(event, template){
       event.preventDefault();
       Meteor.call(
        'addRole',
        Meteor.userId(),
        event.currentTarget.value
        );
     },
     'click #selection':function(event, template){
       event.preventDefault();
       Meteor.call(
        'removeRole',
        Meteor.userId(),
        event.currentTarget.value
        );
     },/*
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
    },*/
    'click #addCastProfile':function(event, template){
      event.preventDefault();

      //Meteor.call('updateProfileType', Meteor.userId(),"both");
      Meteor.call('setIsCast', Meteor.userId(),true);
      

      $('#castModal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      //Session.set("viewAs","cast");
      window.scrollTo(0, 0);
      FlowRouter.go("/editProfileActor/" + Meteor.userId());
    },
    'click #save': function(event, template){
      event.preventDefault();
      Bert.alert({message: 'Se ha guardado tu perfil', type: 'success', icon: 'fa fa-check'});
    },
    'click #saveAndPublish': function(event, template){
      event.preventDefault();
      Bert.alert({message: 'Se ha guardado tu perfil', type: 'success', icon: 'fa fa-check'});
      FlowRouter.go("/profilePage/" + Meteor.userId());
    },

    'change [type="file"]': function(e, t) {
      //console.log(e.target.name);
      uploadFiles(e.target.files, this._id, e.target.name);
      /*
      $('#modal1').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();*/
    },
    'change .category': function(event, template){
    //console.log($(event.target).val() + " - " + event.target.checked);

      if(event.target.checked){
        Meteor.call('addRole', Meteor.userId(), $(event.target).val());
      }
      else{
        Meteor.call('removeRole', Meteor.userId(), $(event.target).val()); 
      }
    },
    'change .activateCrew':function(event, template){
       event.preventDefault();
       if($('.activateCrew').is(":checked") == true){
           $('#category').prop('disabled', false);
           $('#ocupation').prop('disabled', false);
           $('#selection').prop('disabled', false);
           $('#web_page').prop('disabled', false);
           $('#video').prop('disabled', false);
           $('#facebook_page').prop('disabled', false);
           $('#twitter_page').prop('disabled', false);
           $('#vimeo_page').prop('disabled', false);
           $('#youtube_page').prop('disabled', false);
           $('#instagram_page').prop('disabled', false);
           $('#imdb_page').prop('disabled', false);
           Meteor.call('setIsCrew', Meteor.userId(),true);
        }else{
           $('#category').prop('disabled', 'disabled');
           $('#ocupation').prop('disabled', 'disabled');
           $('#selection').prop('disabled', 'disabled');
           $('#web_page').prop('disabled', 'disabled');
           $('#video').prop('disabled', 'disabled');
           $('#facebook_page').prop('disabled', 'disabled');
           $('#twitter_page').prop('disabled', 'disabled');
           $('#vimeo_page').prop('disabled', 'disabled');
           $('#youtube_page').prop('disabled', 'disabled');
           $('#instagram_page').prop('disabled', 'disabled');
           $('#imdb_page').prop('disabled', 'disabled');
           Meteor.call('setIsCrew', Meteor.userId(),false);
        }
     },
     'change .activateCast':function(event, template){
       event.preventDefault();
       if($('.activateCast').is(":checked") == true){
           Meteor.call('setIsCast', Meteor.userId(),true);
        }else{
           Meteor.call('setIsCast', Meteor.userId(),false);
        }
     },

     /*Métodos para cast*/
     'change .sex' : function(event, template){
    event.preventDefault();
    var inputValue = $(event.target).attr("data-answer");
    //console.log(inputValue);
    Meteor.call('updateCastGender', Meteor.userId(), inputValue); 
  },
  'change #age': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastAge', Meteor.userId(), value);
  },
  'change #resumeCast': function(event,template){
    var resumeCast = trimInput(event.target.value);
    Meteor.call('updateCastResume', Meteor.userId(), resumeCast);
  },
  'change #peculiarities': function(event,template){
    var value = event.target.value;
    Meteor.call('updateCastPeculiarities', Meteor.userId(), value);
  },
  'keyup #peculiarities' : function(event){
     event.preventDefault();
     var len = $('#peculiarities').val().length;
     if(len > getParam("MAX_CHAR_IN_TEXTAREA")){
      val.value= val.value.substring(0,getParam("MAX_CHAR_IN_TEXTAREA"));
    }
    else{
      $('#max-peculiarities').text(getParam("MAX_CHAR_IN_TEXTAREA")-len);
    }
  },
  'keyup #skills' : function(event){
     event.preventDefault();
     var len = $('#skills').val().length;
     if(len > getParam("MAX_CHAR_IN_TEXTAREA")){
      val.value= val.value.substring(0,getParam("MAX_CHAR_IN_TEXTAREA"));
    }
    else{
      $('#max-skills').text(getParam("MAX_CHAR_IN_TEXTAREA")-len);
    }
  },
  'change #video_cast': function(event,template){
    event.preventDefault();
    var video = trimInput(event.target.value);
    if(isNotEmpty(video)){
      if(video.indexOf("vimeo")>0){
        Meteor.call('updateCastVimeoDemo', Meteor.userId(), formatURL(video)); 
        Meteor.call('updateCastYoutubeDemo', Meteor.userId(), null); 
      } 
      else if(video.indexOf("youtube")>0){
        Meteor.call('updateCastYoutubeDemo', Meteor.userId(), formatURL(video)); 
        Meteor.call('updateCastVimeoDemo', Meteor.userId(), null); 
      }
      else{
        Bert.alert({message: 'Por el momento únicamente aceptamos videos de vimeo o youtube', type: 'danger', icon: 'fa fa-exclamation'});
      }
      
    }
    else{
      Meteor.call('updateCastYoutubeDemo', Meteor.userId(), null); 
      Meteor.call('updateCastVimeoDemo', Meteor.userId(), null); 
    }
  },
  'change #facebook_cast': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastFacebookPage', Meteor.userId(), value);
  },
  'change #imdb_cast': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastImdbPage', Meteor.userId(), value);
  },
  'change #twitter_cast': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastTwitterPage', Meteor.userId(), value);
  },
  'change #instagram_cast': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastInstagramPage', Meteor.userId(), value);
  },
  'change #vimeo_cast': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastVimeoPage', Meteor.userId(), value);
  },
  'change #youtube_cast': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastYoutubePage', Meteor.userId(), value);
  },
  'change #web_cast': function(event,template){
    var value = trimInput(event.target.value);
    Meteor.call('updateCastWebPage', Meteor.userId(), value);
  },
  
    
  });