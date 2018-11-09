import { Template } from 'meteor/templating';

import './userPage.html';
import '/lib/common.js';


if (Meteor.isClient) {
   Meteor.subscribe("fileUploads");

   Template.userPage.helpers({
     userFullName(){
       if (Meteor.user()){
         return Meteor.user().profile.name + " " + Meteor.user().profile.lastname + " " +Meteor.user().profile.lastname2;
       }
       else{
         return "Nada";
       }
     }
   });



   Template.user.helpers({
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
            return Meteor.user().profile.resume;
         }
      },
      webpage(){
         if(Meteor.user()){
            return Meteor.user().profile.webpage;
         }
      },
      facebook(){
         if(Meteor.user()){
            return Meteor.user().profile.facebook;
         }
      },
      twitter(){
         if(Meteor.user()){
            return Meteor.user().profile.twitter;
         }
      },
      vimeo(){
         if(Meteor.user()){
            return Meteor.user().profile.vimeo;
         }
      },
      youtube(){
         if(Meteor.user()){
            return Meteor.user().profile.youtube;
         }
      },
      instagram(){
         if(Meteor.user()){
            return Meteor.user().profile.instagram;
         }
      },
      roleSelected: function(value){
        var result="";
        var prole = Meteor.user().profile.role;
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
      personalCover:function(){
         Meteor.subscribe("personalcover");
         return PersonalCover.find({'owner': Meteor.userId()});
      }

      /*,
      profilePicture: function () {
         if(Meteor.user()){
            return Images.find({'owner': Meteor.userId()}); //, 'use': 'profile'
         }
      }*/
   });

   Template.user.events({
     'click #updateName': function(event, template) {
      event.preventDefault();
      var name, lastname, lastname2;
     
      name = $('#personName').val();
      lastname = $('#personLastName').val();
      lastname2 = $('#personLastName2').val();

      if(name!="" || lastname!="" || lastname2!=""){
         console.log('Actualizando nombre del usuario ' + name + " " + lastname + " " + lastname2);
         
         Meteor.users.update({_id: Meteor.userId()}, {$set: 
            {"profile.name": name, 
             "profile.lastname": lastname, 
             "profile.lastname2": lastname2
            }
         });
         
         $('#personName').val("");
         $('#personLastName').val("");
         $('#personLastName2').val("");
         sAlert.success('Tu nombre ha sido actualizado',{});
      }
      else{
         sAlert.error('Los campos no pueden estar vacíos',{});   
      } 
         
        
     },
     'click #guardar_set1': function(event, template){
         console.log('Entrando a la función');
         
         event.preventDefault();
         var ocupation, resume, webpage, facebook_page, twitter, vimeo, youtube, instagram;

         var name, lastname, lastname2;
        
         name = $('#personName').val();
         lastname = $('#personLastName').val();
         lastname2 = $('#personLastName2').val();
         ocupation = $('#ocupation').val(); 
         resume = $('#resume').val();

         if(name!="" || lastname!="" || lastname2!="" || ocupation!="" || resume!=""){
            console.log('Actualizando nombre del usuario ' + name + " " + lastname + " " + lastname2);
            
            Meteor.users.update({_id: Meteor.userId()}, {$set: 
               {"profile.name": name, 
                "profile.lastname": lastname, 
                "profile.lastname2": lastname2,
                "profile.role" : ocupation,
                "profile.resume" : resume
               }
            });
            
         }
         else{
            sAlert.error('Los campos no pueden estar vacíos',{});   
         } 


         
         webpage = $('#web_page').val();
         facebook = $('#facebook_page').val();
         twitter = $('#twitter_page').val();
         vimeo = $('#vimeo_page').val();
         youtube = $('#youtube_page').val();
         instagram = $('#instagram_page').val();
         userId = Meteor.userId();

         console.log('Actualizando los datos de '+ userId);
         Meteor.users.update({_id: Meteor.userId()}, {$set: {
            "profile.webpage": webpage, 
            "profile.facebook": facebook,
            "profile.twitter": twitter,
            "profile.vimeo": vimeo,
            "profile.youtube": youtube,
            "profile.instagram": instagram
            
         }});
         console.log('Datos actualizados');
         sAlert.success('Tus datos han sido actualizados');
         FlowRouter.go('/viewProjects/' + Meteor.userId());
      },

      'click #deleteFileButton ': function (event) {
         console.log("deleteFile button ", this);
         Images.remove({_id:this._id});
      },
      'change .your-upload-class': function (event, template) {
         console.log("uploading...")
         FS.Utility.eachFile(event, function (file) {
            console.log("each file...");
            var yourFile = new FS.File(file);
            yourFile.owner = Meteor.userId(); 
            yourFile.use = 'profile';
            /*
            var cloudName = "";  
            var uploadedFile = Cloudinary.upload(file, {cloud_name: 'lymoncloud', upload_preset: 'sbtnk41k', api_key: '537431661225814', api_secret: 'T770GCn2wX_LylMacIgC4S3krYo'},function(err, res) {
               cloudName = res.url;
               console.log("Upload Error: " + err);
               console.log("Upload Result: " + res);
               
            });
            if(cloudName!="" && cloudName!=null){
               console.log("La imagen se va a llamar" + cloudName);
               yourFile.cloudName = cloudName;
            }
            
            */


            var verifyOnlyOne = Images.find({'owner': Meteor.userId()}).forEach( function(myDoc) {
               console.log("Va a borrar " + myDoc._id);
               Images.remove({'_id': myDoc._id});
            });

            /*for (var k in verifyOnlyOne) {
               console.log("Va a borrar " + verifyOnlyOne[k]);
               Images.remove({'_id': verifyOnlyOne[k]['_id']});               
            }*/

            
            Images.insert(yourFile, function (err, fileObj) {
                 console.log("callback for the insert, err: ", err);
                 if (!err) {
                   console.log("inserted without error");
                   sAlert.success('Tus foto de perfil ha cambiado');
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
                   sAlert.success('Tus foto de portada ha cambiado');
                 }
                 else {
                   console.log("there was an error", err);
                 }    
            });

         });
      }

   });
}


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