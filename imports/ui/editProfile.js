import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';


import './editProfile.html';
import '/lib/common.js';
import {Croper} from '../cropper/cropper.js';


if (Meteor.isClient) {
   Meteor.subscribe("fileUploads");
   Meteor.subscribe("getOcupations");
   Meteor.subscribe("getCategories");
   Meteor.subscribe("getCountries");
   Meteor.subscribe("userData");

/*
Template.userPage.rendered = function(){
  
  //if(Meteor.user()){
    let wizard = Meteor.user().wizard;
    if(wizard){
      $('#myModal').show();
    }
  //}

};*/


   Template.user.helpers({
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
         if(Meteor.user()){
            return Meteor.user().resume;
         }
      },
      resumeCount(){
        if(Meteor.user()){
          var rest = Meteor.user().resume;
          var result = 0;
          if(rest!=null && rest.length!=null){
            result = (450 - rest.length);
          }
          return result;
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
        var state = Meteor.user().city;
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
      },/*
      personalCover:function(){
         Meteor.subscribe("personalcover");
         return PersonalCover.find({'owner': Meteor.userId()});
      },*/
      getCategories(){
         var data = Ocupation.find({},{sort:{'title':1}}).fetch();
         return _.uniq(data, false, function(transaction) {return transaction.title});
      },
      getOcupationsFromCategory(){
         
         if(Session.get("selected_category")!=null){
            return Ocupation.find({'title': Session.get("selected_category")}).fetch();
          }
          else{
            return Ocupation.find({'title': "Actor"}).fetch();
          }
      },
      getRolesSelected: function(){
        return Meteor.user().role;
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
         return City.find({'state': 'Baja California Sur'}).fetch(); 
        }

      },
      getProfilePicture() {

         if(Meteor.user().profilePictureID!=null){
            var profile = Media.findOne({'mediaId':Meteor.user().profilePictureID});
            if(profile!=null){
              return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_80,h_80,c_thumb,f_auto,r_max/" + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().profilePictureID;    
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
              return Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + profile.media_version + "/" + Meteor.userId() + "/" + Meteor.user().profileCoverID;    
            }
            
          }
        /*
         var url = "";
         if(Meteor.user().profileCoverID!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_250,c_scale/" + Meteor.user().profileCoverID;
         }
         return url;*/
      },
      getPublicID(type){
        if(type==='profile'){
          return Meteor.user().profilePictureID;
        }
        else if(type==='cover'){
          return Meteor.user().profileCoverID;  
        }
        
      },
      getMedia(type) {
        Meteor.subscribe("allMedia");
        var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
        return media;
      },
      getURL(mediaId){
        var url = "";
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/" + mediaId;
        return url;
      }

      /*,
      hasTopRole(){
        var array = new Array();
        var result = false;
        if(Meteor.user().role!=null){
          array = Meteor.user().role;
          for (var i = array.length - 1; i >= 0; i--) {
            if(array[i]==="Director"){
              result = true;  
            }
            if(array[i]==="Productor"){
              result = true;  
            }
          }
        }
        return result;
    }*/
      
   });

   Template.user.events({
     
     'click #guardar_set1': function(event, template){
         event.preventDefault();

         var name = trimInput($('#personName').val());
         var lastname = trimInput($('#personLastName').val());
         var lastname2 = trimInput($('#personLastName2').val());
         var city = trimInput($('#city').val()); 
         var state = trimInput($('#state').val()); 
         var country = trimInput($('#country').val()); 
         var resume = trimInput($('#resume').val());
         var webpage = trimInput($('#web_page').val());
         var facebook = trimInput($('#facebook_page').val());
         var twitter = trimInput($('#twitter_page').val());
         var vimeo = trimInput($('#vimeo_page').val());
         var youtube = trimInput($('#youtube_page').val());
         var instagram = trimInput($('#instagram_page').val());
         var userId = Meteor.userId();
         var fullname = name + " " + lastname + " " + lastname2;

         if(isNotEmpty(name) && isNotEmpty(lastname) && isNotEmpty(resume)){
            Meteor.call(
              'updateUser',
              userId,
              name,
              lastname, 
              lastname2,
              city,
              state,
              country,
              resume,
              fullname,
              webpage, 
              facebook,
              twitter,
              vimeo,
              youtube,
              instagram
            );

            Bert.alert({message: 'Se ha actualizado tu perfil', type: 'success', icon: 'fa fa-check'});
            FlowRouter.go('/profilePage/' + Meteor.userId());
         }
         return false
      },

      'click .goMediaLibrary': function(event,template){
        event.preventDefault();
        $('.modal').modal('hide'); 
        $('.modal-backdrop').remove();
        FlowRouter.go("/mediaEditor/" + Meteor.userId());
      },

      'click #selectProfilePicture': function(event,template){
         event.preventDefault();
         var mediaId = $(event.currentTarget).attr("data-id");

         console.log(mediaId);

         Meteor.call(
            'updateProfilePicture',
            Meteor.userId(),
            mediaId
          );

        $('.modal').modal('hide'); 
        $('.modal-backdrop').remove();

      },

      'click #selectCoverPicture': function(event,template){
         event.preventDefault();
         var mediaId = $(event.currentTarget).attr("data-id");

         Meteor.call(
            'updateCoverPicture',
            Meteor.userId(),
            mediaId
          );

        $('.modal').modal('hide'); 
        $('.modal-backdrop').remove();

      },

      'keyup #resume' : function(event){
         event.preventDefault();
         
         var len = $('#resume').val().length;
         if(len > 450){
            val.value= val.value.substring(0,450);
         }
         else{
            $('#max').text(450-len);
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
      /*
      'change .your-upload-class': function (event, template) {
         console.log("uploading...")
         FS.Utility.eachFile(event, function (file) {
            console.log("each file...");
            var yourFile = new FS.File(file);
            yourFile.owner = Meteor.userId(); 
            yourFile.use = 'profile';
            

            var verifyOnlyOne = Images.find({'owner': Meteor.userId()}).forEach( function(myDoc) {
               console.log("Va a borrar " + myDoc._id);
               Images.remove({'_id': myDoc._id});
            });*/

            /*for (var k in verifyOnlyOne) {
               console.log("Va a borrar " + verifyOnlyOne[k]);
               Images.remove({'_id': verifyOnlyOne[k]['_id']});               
            }*/

            /*
            Images.insert(yourFile, function (err, fileObj) {
                 console.log("callback for the insert, err: ", err);
                 if (!err) {
                   console.log("inserted without error");
                   Bert.alert({message: 'Tu foto de perfil ha cambiado', type: 'info'});
                   
                 }
                 else {
                   console.log("there was an error", err);
                 }    
            });

         });
      },
      'change .your-cover-class': function (event, template) {
         console.log("uploading...")
         FS.Utility.eachFile(event, function (file) {
            console.log("each file...");
            var yourFile = new FS.File(file);
            yourFile.owner = Meteor.userId(); 
            yourFile.use = 'profile';

            var verifyOnlyOne = PersonalCover.find({'owner': Meteor.userId()}).forEach( function(myDoc) {
               console.log("Va a borrar " + myDoc._id);
               PersonalCover.remove({'_id': myDoc._id});
            });

            PersonalCover.insert(yourFile, function (err, fileObj) {
                 console.log("callback for the insert, err: ", err);
                 if (!err) {
                   console.log("inserted without error");
                   Bert.alert({message: 'Tu foto de portada ha cambiado', type: 'info'});
                   
                 }
                 else {
                   console.log("there was an error", err);
                 }    
            });

         });
      },*/
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
      'change #country':function(event, template){
         event.preventDefault();
         Session.set("selected_country", event.currentTarget.value);
      },
      'change #state':function(event, template){
         event.preventDefault();
         Session.set("selected_state", event.currentTarget.value);
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
      'dblclick #image':function(event, template){
          
          var croppable = false;
          var croppedCanvas;
          var roundedImage;
          const cropper = new Cropper(image, {

          dragMode: 'move',
          aspectRatio: 16 / 9,
          autoCropArea: 0.65,
          restore: false,
          guides: false,
          center: false,
          highlight: false,
          cropBoxMovable: true,
          cropBoxResizable: false,
          toggleDragModeOnDblclick: false,
          ready() {
            croppable = true;
          },
          crop(event) {
            /*console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            /*console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);*/
            croppedCanvas = cropper.getCroppedCanvas();
            roundedImage = document.createElement('img');
            roundedImage.src = croppedCanvas.toDataURL()
            result.innerHTML = '';
            result.appendChild(roundedImage);
          },
        });
      },
      'click #crop': function(event,template){
        var image = document.getElementById('image');
        var button = document.getElementById('crop');
        var result = document.getElementById('result');
        var croppedCanvas;
        var roundedCanvas;
        var roundedImage;

        // Crop
        croppedCanvas = cropper.getCroppedCanvas();

        // Round
        roundedCanvas = getRoundedCanvas(croppedCanvas);

        // Show
        roundedImage = document.createElement('img');
        roundedImage.src = roundedCanvas.toDataURL()
        result.innerHTML = '';
        result.appendChild(roundedImage);
      }
   });
}


var trimInput= function(val){
  return val.replace(/^\s*|\s*$/g, "");
}

var isNotEmpty=function(val){
  if(val && val!== ""){
    return true;
  }
//  Bert.alert("", "danger", "growl-top-right");
  Bert.alert({message: 'Por favor completa todos los campos obligatorios', type: 'danger', icon: 'fa fa-exclamation'});
  return false;
}


/*
if (Meteor.isServer) {
  Images.allow({
     'insert': function (userId, doc) {
       // add custom authentication code here
       return true;
     },
     'remove': function (userId, doc) {
       return true;
     },
     'download': function (userId, doc) {
       return true;
     }
   });
  PersonalCover.allow({
     'insert': function (userId, doc) {
       // add custom authentication code here
       return true;
     },
     'remove': function (userId, doc) {
       return true;
     },
     'download': function (userId, doc) {
       return true;
     }
   });
}
*/
/*
,
   'click #deleteFileButton ': function (event) {
        console.log("deleteFile button ", this);
        FileData.remove({_id:this._id});
        
   },
   'change .your-upload-class': function (event, template) {
    console.log("uploading...")
    FS.Utility.eachFile(event, function (file) {
      console.log("each file...");
      var yourFile = new FS.File(file);
      yourFile.creatorId = 123; // todo
      FileData.insert(yourFile, function (err, fileObj) {
        console.log("callback for the insert, err: ", err);
        if (!err) {
          console.log("inserted without error");
        }
        else {
          console.log("there was an error", err);
        }
      });
*/