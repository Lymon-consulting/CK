import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Ocupation } from '../api/ocupations.js';
import { getParam } from '/lib/functions.js';

import './userProjects.html';
import '/lib/common.js';


if (Meteor.isClient) {
   Meteor.subscribe("fileUploads");

   

   Template.projects.helpers({
     getAvailableYears(){
        var years = new Array();
        var MIN_YEAR = getParam("MIN_YEAR");
        var MAX_YEAR = getParam("MAX_YEAR");
        for(i=MAX_YEAR; i>MIN_YEAR; i--){
          years.push(i);
        }
        return years;
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
      }
   });

   
   Template.projects.events({
      'change #proj_main': function(event) {
        var x = event.target.checked;
        $('#isMainProject').val(x);
        console.log($('#isMainProject').val());
       },
      'click #guardar_proyecto': function(event, template) {
          event.preventDefault();
          var proj_name = trimInput($('#proj_name').val());
          var proj_type = $('#proj_type').val();
          var proj_genre = $('#proj_genre').val();
          var proj_desc = trimInput($('#proj_desc').val());
          var proj_year = $('#proj_year').val();
          var proj_role = Session.get("ocupation_temp");
          
          
          var proj_main = $('#isMainProject').val();
          var proj_web_page = trimInput($('#proj_web_page').val());
          var proj_facebook_page = trimInput($('#facebook_page').val());
          var proj_twitter_page = trimInput($('#twitter_page').val());
          var proj_vimeo_page = trimInput($('#vimeo_page').val());
          var proj_youtube_page = trimInput($('#youtube_page').val());
          var proj_instagram_page = trimInput($('#instagram_page').val());

          if(isNotEmpty(proj_name) && 
              isNotEmpty(proj_type) && 
              isNotEmpty(proj_genre) && 
              isNotEmpty(proj_desc) &&
              isNotEmpty(proj_year) &&
              isNotEmpty(proj_role)){
                Meteor.call(
                   'insertProject',
                   Meteor.userId(),
                   proj_name,
                   proj_type,
                   proj_genre,
                   proj_desc, 
                   proj_year,
                   proj_role,
                   proj_main,
                   proj_web_page,
                   proj_facebook_page,
                   proj_twitter_page,
                   proj_vimeo_page,
                   proj_youtube_page,
                   proj_instagram_page,
                   function(err,result){
                     if(!err){
                      $.cloudinary.config({
                        cloud_name:"drhowtsxb"
                      });

                      var options = {
                        folder: Meteor.userId()
                      };

                      var file = document.getElementById('project-img-upload').files[0];

                      Cloudinary.upload(file, options, function(err,res){
                        if(!err){
                          Meteor.call(
                            'saveProjectPictureID',
                            result,
                            res.public_id
                          );
                        }
                        else{
                          console.log("Upload Error:"  + err); //no output on console
                        }
                      });
                       Bert.alert({message: 'El proyecto ha sido agregado', type: 'success', icon: 'fa fa-check'});
                       Session.set("ocupation_temp",null);
                       Session.set("selected_category",null);
                       FlowRouter.go('/projectPage/' + result);       
                     }
                     else{
                       console.log("Ocurrió el siguiente error: " +err);
                     }
                   }
                );
                

          }
          return false;
      },
      'change #category':function(event, template){
         event.preventDefault();
         Session.set("selected_category", event.currentTarget.value);
      },
      'dblclick #ocupation':function(event, template){
         event.preventDefault();
         var ocupation;
         var encontrado=false;
         if(Session.get("ocupation_temp")!=null){
            ocupation = Session.get("ocupation_temp");
            for(i=0; i< ocupation.length; i++){
               if(ocupation[i]===event.currentTarget.value){
                  encontrado = true;
                  break;
               }
               else{
                  encontrado = false
               }
            }
            if(!encontrado){
              ocupation.push(event.currentTarget.value);     
            }
         }
         else{
           ocupation = new Array();
           ocupation.push(event.currentTarget.value);
         }

         Session.set("ocupation_temp",ocupation);

         for(i=0; i< ocupation.length; i++){
            $("#selection option[value='"+ocupation[i]+"']").remove();
         }
         for(i=0; i< ocupation.length; i++){
            $('#selection').append(new Option(ocupation[i], ocupation[i])); 
         }

         
         
      },
      'dblclick #selection':function(event, template){
         event.preventDefault();
         var valor = event.currentTarget.value;
         
         var ocupation;
         if(Session.get("ocupation_temp")!=null && valor!=""){
            ocupation = Session.get("ocupation_temp");
            console.log("borrando del select "+ ocupation.length +" elementos");
            for(var i=0; i < ocupation.length; i++){
              $("#selection option[value='"+ocupation[i]+"']").remove();
            }
            
            console.log("Eliminando el valor que recibió el doble clic del arreglo "+valor);
            for(var i = ocupation.length - 1; i >= 0; i--){
              console.log("ocupation[i]="+ocupation[i])
              if(ocupation[i]===valor){
                console.log("ya lo eliminó");
                ocupation.splice(i,1);
              }
            }
            
            Session.set("ocupation_temp",null);
            Session.set("ocupation_temp",ocupation);
            
            for(i=0; i< ocupation.length; i++){
              $('#selection').append(new Option(ocupation[i], ocupation[i])); 
            }

         }
      },
      'keyup #proj_desc' : function(event){
         event.preventDefault();
         
         var len = $('#proj_desc').val().length;
         if(len > 450){
            val.value= val.value.substring(0,450);
         }
         else{
            $('#max').text(450-len);
         }
      }
   });

}

var trimInput= function(val){
  if(val!=null && val!=""){
    return val.replace(/^\s*|\s*$/g, "");  
  }
  return false;
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
}
*/