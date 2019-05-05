import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Ocupation } from '../api/ocupations.js';

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

   Template.projects.helpers({
     getAvailableYears(){
        var years = new Array();

        for(i=2018; i>1970; i--){
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
          var proj_name = $('#proj_name').val();
          var proj_type = $('#proj_type').val();
          var proj_genre = $('#proj_genre').val();
          var proj_desc = $('#proj_desc').val();
          var proj_year = $('#proj_year').val();
          var proj_role = Session.get("ocupation_temp");
          
          
          var proj_main = $('#isMainProject').val();
          var proj_web_page = $('#proj_web_page').val();
          var proj_facebook_page = $('#proj_facebook_page').val();
          var proj_twitter_page = $('#proj_twitter_page').val();
          var proj_vimeo_page = $('#proj_vimeo_page').val();
          var proj_youtube_page = $('#proj_youtube_page').val();
          var proj_instagram_page = $('#proj_instagram_page').val();

          console.log("Los valores del arreglo son "+ proj_role);

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
               proj_instagram_page
            );
            Bert.alert({message: 'El proyecto ha sido agregado', type: 'info'});
            Session.set("ocupation_temp",null);
            Session.set("selected_category",null);
            FlowRouter.go('/viewProjects/' + Meteor.userId());
          }
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
