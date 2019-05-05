import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Ocupation } from '../api/ocupations.js';

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
         return Project.findOne({'_id': FlowRouter.getParam('id')});
      },
      typeSelected: function(value){
        var ptype = Project.findOne({'_id': FlowRouter.getParam('id')}).project_type;
        return (ptype === value) ? 'selected' : '' ;
      },
      genreSelected: function(value){
        var pgenre = Project.findOne({'_id': FlowRouter.getParam('id')}).project_genre;
        return (pgenre === value) ? 'selected' : '' ;
      },
      yearSelected: function(value){
        var pyear = Project.findOne({'_id': FlowRouter.getParam('id')}).project_year;
        return (pyear === value) ? 'selected' : '' ;
      },
      isMainProject: function(value){
        var main = Project.findOne({'_id': FlowRouter.getParam('id')});
        var verify = 'false';
        if(main!=null){
          verify = main.project_is_main;
        }
        return (verify === 'true') ? 'checked' : '' ; 
      },
      getRolesSelected: function(){
        var proj = Project.findOne({'_id': FlowRouter.getParam('id')});
        var data;
        if(proj!=null){
           data = proj.project_role;
        }
        return data;
      },
      roleSelected: function(value){
        var result="";
        var prole = Project.findOne({'_id': FlowRouter.getParam('id')}).project_role;
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
            Meteor.subscribe("cover");
            return Cover.find({'project_id': FlowRouter.getParam('id')});
         }
      },
      getProjectType(){
        var type = new Array();
        type.push("Cortometraje");
        type.push("Largometraje");
        type.push("Comercial");
        type.push("Fashion film");
        type.push("Serie/programa televison");
        type.push("Videoclip");
        return type;
     },
     getProjectGender(){
        var type = new Array();
        type.push("Cortometraje");
        type.push("Animacion");
        type.push("Comedia");
        type.push("Documental");
        type.push("Drama");
        type.push("Ensayo");
        type.push("Experimental");
        type.push("Fantastico");
        type.push("Hibrido");
        type.push("Horror/gore");
        type.push("Infantil");
        type.push("LGBT");
        type.push("Musical");
        type.push("Sc-fi");
        type.push("Suspenso/ misterio");
        return type;
     },
     getAvailableYears(){
        var years = new Array();

        for(i=2018; i>1970; i--){
          years.push(i);
        }
        return years;
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
      roleSelected: function(value){
        var result="";
        var prole;
        var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
        if(data!=null){
          prole = data.project_role;  
        }
        
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
      typeSelected: function(value){
        var result="";
        var prole;
        var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
        if(data!=null){
          prole = data.project_type;  
        }
        
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
      genderSelected: function(value){
        var result="";
        var prole;
        var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
        if(data!=null){
          prole = data.project_genre;  
        }
        
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
      yearSelected: function(value){
        var result="";
        var prole;
        var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
        if(data!=null){
          prole = data.project_year;  
        }
        
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
          var proj_name = $('#proj_name').val();
          var proj_type = $('#proj_type').val();
          var proj_genre = $('#proj_gender').val();
          var proj_desc = $('#proj_desc').val();
          var proj_year = $('#proj_year').val();
          var proj_role = $('#selection').val();
          var proj_main = $('#isMainProject').val();
          var proj_web_page = $('#proj_web_page').val();
          var proj_facebook_page = $('#proj_facebook_page').val();
          var proj_twitter_page = $('#proj_twitter_page').val();
          var proj_vimeo_page = $('#proj_vimeo_page').val();
          var proj_youtube_page = $('#proj_youtube_page').val();
          var proj_instagram_page = $('#proj_instagram_page').val();


          if(proj_name===""){
            Bert.alert({message: 'El nombre del proyecto no puede estar vacío', type: 'error'});
          }
          else if(proj_type===""){
            Bert.alert({message: 'El tipo de proyecto no puede estar vacío', type: 'error'});
          }
          else if(proj_genre===""){
            Bert.alert({message: 'El género del proyecto no puede estar vacío', type: 'error'});
          }
          else if(proj_desc===""){
            Bert.alert({message: 'La descripción del proyecto no puede estar vacía', type: 'error'});
          }
          else if(proj_year===""){
            Bert.alert({message: 'El año del proyecto no puede estar vacío', type: 'error'});
          }
          else if(proj_role===""){
            Bert.alert({message: 'El rol del proyecto no puede estar vacío', type: 'error'});
          }
          else{
     

            if(proj_main==='true'){
              otherProjects = Project.find({userId: Meteor.userId()}).fetch();
              otherProjects.forEach(function(current_value) {
                  //Project.update({_id: current_value._id},{$set:{"project_is_main": "" }});   
                  Meteor.call(
                    'updateMain',
                    current_value._id
                    );    
              });
            }
            Meteor.call(
               'updateProject',
               FlowRouter.getParam('id'),
               proj_name,
               proj_type,
               proj_genre,
               proj_desc, 
               proj_year,
               proj_main,
               proj_web_page,
               proj_facebook_page,
               proj_twitter_page,
               proj_vimeo_page,
               proj_youtube_page,
               proj_instagram_page
            );
            
            Bert.alert({message: 'El proyecto ha sido actualizado', type: 'info'});
            //Session.set("projID", null);
            FlowRouter.go('/viewProjects/' + Meteor.userId());
         }
      },
      'click #deleteFileButton ': function (event) {
         //console.log("deleteFile button ", this);
         event.preventDefault();
         if(confirm("¿Eliminar imagen de portada?")){
            Cover.remove({_id:this._id}); 
         }
         
      },
      'change .your-upload-class': function (event, template) {
         console.log("uploading...")
         FS.Utility.eachFile(event, function (file) {
            console.log("each file...");
            var yourFile = new FS.File(file);
            yourFile.project_id = FlowRouter.getParam('id'); 
            
            var verifyOnlyOne = Cover.find({'project_id':FlowRouter.getParam('id')}).forEach( function(myDoc) {
               console.log("Va a borrar " + myDoc._id);
               //Images.remove({'_id': myDoc._id});
            });

            
            Cover.insert(yourFile, function (err, fileObj) {
                 console.log("callback for the insert, err: ", err);
                 if (!err) {
                   console.log("inserted without error");
                   Bert.alert({message: 'Tu foto de proyecto ha cambiado', type: 'info'});
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
         console.log("detectó doble click " + FlowRouter.getParam('id') + ","+ event.currentTarget.value);
         Meteor.call(
            'addRoleToProject',
            FlowRouter.getParam('id'),
            event.currentTarget.value
         );
      },
      'dblclick #selection':function(event, template){
         event.preventDefault();
         
         Meteor.call(
            'removeRoleFromProject',
            FlowRouter.getParam('id'),
            event.currentTarget.value
         );
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
