import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';

import './userProjects.html';
import '/lib/common.js';


if (Meteor.isClient) {
   Meteor.subscribe("fileUploads");

   Template.userProjects.helpers({
     userFullName(){
       if (Meteor.user()){
         return Meteor.user().profile.name + " " + Meteor.user().profile.lastname + " " +Meteor.user().profile.lastname2;
       }
       else{
         return "Nada";
       }
     }
   });


   Template.projects.events({
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
      proj_main = $('#proj_main').val();
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
      Project.insert({
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
            "proj_instagram_page": proj_instagram_page,
            "userId": Meteor.userId()
         });
         console.log('Proyecto agregado');
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
}
