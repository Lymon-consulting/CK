import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';

import './userEditProject.html';
import '/lib/common.js';


if (Meteor.isClient) {
   Meteor.subscribe("fileUploads");

   Template.userEditProject.helpers({
     userFullName(){
       if (Meteor.user()){
         return Meteor.user().profile.name + " " + Meteor.user().profile.lastname + " " +Meteor.user().profile.lastname2;
       }
       else{
         return "Nada";
       }
     }
   });

   Template.editProject.helpers({
      projData(){

         return Project.findOne({'_id': Session.get("projID")});
      },
      typeSelected: function(value){
        var ptype = Project.findOne({'_id': Session.get("projID")}).project_type;
        return (ptype === value) ? 'selected' : '' ;
      },
      genreSelected: function(value){
        var pgenre = Project.findOne({'_id': Session.get("projID")}).project_genre;
        return (pgenre === value) ? 'selected' : '' ;
      },
      yearSelected: function(value){
        var pyear = Project.findOne({'_id': Session.get("projID")}).project_year;
        return (pyear === value) ? 'selected' : '' ;
      },
      isMainProject: function(value){
        var main = Project.findOne({'_id': Session.get("projID")}).project_is_main;
        return (main === 'true') ? 'checked' : '' ; 
      },
      roleSelected: function(value){
        var result="";
        var prole = Project.findOne({'_id': Session.get("projID")}).project_role;
        var elem = prole.indexOf(value);
        if(elem >= 0){
          result = 'selected';
        }
        else{
          result = "";
        } 
        return result;
      },
      coverPicture: function () {
         if(Meteor.user()){
            return Cover.find({'project_id': Session.get("projID")});
         }
      }
   });


   Template.editProject.events({
      'change #proj_main': function(event) {
        var x = event.target.checked;
        $('#isMainProject').val(x);
        console.log($('#isMainProject').val());
       },
      'click #guardar_proyecto': function(event, template) {
      event.preventDefault();
      console.log('Guardando datos del proyecto...');
      var proj_name, proj_type, proj_genre, proj_desc, proj_year, proj_role, proj_main; 
      var proj_web_page, proj_facebook_page, proj_twitter_page, proj_vimeo_page, proj_youtube_page, proj_instagram_page;
     
      proj_name = $('#proj_name').val();
      proj_type = $('#proj_type').val();
      proj_genre = $('#proj_genre').val();
      proj_desc = $('#proj_desc').val();
      proj_year = $('#proj_year').val();
      proj_role = $('#proj_role').val();
      proj_main = $('#isMainProject').val();
      proj_web_page = $('#proj_web_page').val();
      proj_facebook_page = $('#proj_facebook_page').val();
      proj_twitter_page = $('#proj_twitter_page').val();
      proj_vimeo_page = $('#proj_vimeo_page').val();
      proj_youtube_page = $('#proj_youtube_page').val();
      proj_instagram_page = $('#proj_instagram_page').val();

     

      /*
         doc = Collection.findOne({owner: Meteor.userId()});
         doc ? Collection.update({_id: doc._id}, {$set: {field: value}})  : Collection.insert({owner: Meteor.userId(), field: value});
      */

      if(proj_main==='true'){
         otherProjects = Project.find({userId: Meteor.userId()}).fetch();
         otherProjects.forEach(function(current_value) {
            Project.update({_id: current_value._id},{$set:{"project_is_main": "" }});       
         });
      }

      Project.update({_id: Session.get("projID")},{$set:{
            "project_title": proj_name,
            "project_type": proj_type,
            "project_genre": proj_genre,
            "project_desc": proj_desc, 
            "project_year": proj_year,
            "project_role": proj_role,
            "project_is_main": proj_main,
            "project_web_page": proj_web_page,
            "project_facebook_page": proj_facebook_page,
            "project_twitter_page": proj_twitter_page,
            "proj_vimeo_page": proj_vimeo_page,
            "proj_youtube_page": proj_youtube_page,
            "proj_instagram_page": proj_instagram_page
         }});
         console.log('Proyecto actualizado');
         //Session.set("projID", null);
         FlowRouter.go('/viewProjects/' + Meteor.userId());
      },
      'click #deleteFileButton ': function (event) {
         console.log("deleteFile button ", this);
         Cover.remove({_id:this._id});
      },
      'change .your-upload-class': function (event, template) {
         console.log("uploading...")
         FS.Utility.eachFile(event, function (file) {
            console.log("each file...");
            var yourFile = new FS.File(file);
            yourFile.project_id = Session.get("projID"); 
            
            var verifyOnlyOne = Cover.find({'project_id':Session.get("projID")}).forEach( function(myDoc) {
               console.log("Va a borrar " + myDoc._id);
               //Images.remove({'_id': myDoc._id});
            });

            
            Cover.insert(yourFile, function (err, fileObj) {
                 console.log("callback for the insert, err: ", err);
                 if (!err) {
                   console.log("inserted without error");
                   sAlert.success('Tus foto de proyecto ha cambiado');
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
  Cover.allow({
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
