import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';

import './userPage.html';
import '/lib/common.js';



if (Meteor.isClient) {
   Meteor.subscribe("fileUploads");
   Meteor.subscribe("getOcupations");
   Meteor.subscribe("getCategories");
   Meteor.subscribe("getCountries");

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
      citySelected: function(value){
        var result="";
        var city = Meteor.user().profile.city;
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
      countrySelected: function(value){
        var result="";
        var country = Meteor.user().profile.country;
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
      personalCover:function(){
         Meteor.subscribe("personalcover");
         return PersonalCover.find({'owner': Meteor.userId()});
      },
      getCategories(){
         var data = Ocupation.find().fetch();
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
      getRolesSelected: function(){
        return Meteor.user().profile.role;
      },
      getCountries(){
         var data = City.find().fetch();
         return _.uniq(data, false, function(transaction) {return transaction.country});
      },
      getCitiesFromCountries(){
        
        if(Session.get("selected_country")!=null){
          return City.find({'country': Session.get("selected_country")}).fetch();
        }
        else{
         return City.find({'country': 'México'}).fetch(); 
        }

      }


      /*,
      profilePicture: function () {
         if(Meteor.user()){
            return Images.find({'owner': Meteor.userId()}); //, 'use': 'profile'
         }
      }*/
   });

   Template.user.events({
    /*
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
             "profile.lastname2": lastname2,
             "profile.fullname": name + " " + lastname + " " + lastname2
            }
         });

         
         $('#personName').val("");
         $('#personLastName').val("");
         $('#personLastName2').val("");
         Bert.alert({message: 'Tu nombre ha sido actualizado', type: 'info'});
         
      }
      else{
         Bert.alert({message: 'Los campos no pueden estar vacíos', type: 'error'});
         
      } 
         
        
     },*/
     'click #guardar_set1': function(event, template){
         event.preventDefault();

         var name = $('#personName').val();
         var lastname = $('#personLastName').val();
         var lastname2 = $('#personLastName2').val();
         var city = $('#city').val(); 
         var country = $('#country').val(); 
         var resume = $('#resume').val();
         var webpage = $('#web_page').val();
         var facebook = $('#facebook_page').val();
         var twitter = $('#twitter_page').val();
         var vimeo = $('#vimeo_page').val();
         var youtube = $('#youtube_page').val();
         var instagram = $('#instagram_page').val();
         var userId = Meteor.userId();
         var fullname = name + " " + lastname + " " + lastname2;

         if(name===""){
            Bert.alert({message: 'El nombre no puede estar vacío', type: 'error'}); 
         }
         else if(lastname===""){
            Bert.alert({message: 'El apellido paterno no puede estar vacío', type: 'error'}); 
         }
         else if(resume===""){
            Bert.alert({message: 'El resumen no puede estar vacío', type: 'error'}); 
         }
         else{
            Meteor.call(
              'updateUser',
              userId,
              name,
              lastname, 
              lastname2,
              city,
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

            Bert.alert({message: 'Tus datos han sido actualizados', type: 'info'});
            FlowRouter.go('/viewProjects/' + Meteor.userId());
         }
         
      },

      'click #deleteFileButton ': function (event) {
         event.preventDefault();
         if(confirm("Se va a eliminar esta imagen de portada ¿estás seguro?")){
           console.log("deleteFile button ", this);
           Images.remove({_id:this._id});
         }
      },
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
            });

            /*for (var k in verifyOnlyOne) {
               console.log("Va a borrar " + verifyOnlyOne[k]);
               Images.remove({'_id': verifyOnlyOne[k]['_id']});               
            }*/

            
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
      'change #country':function(event, template){
         event.preventDefault();
         Session.set("selected_country", event.currentTarget.value);
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