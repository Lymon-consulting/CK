import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Ocupation } from '../api/ocupations.js';

import './addIndustry.html';
import '/lib/common.js';


if (Meteor.isClient) {
 Meteor.subscribe("fileUploads");



 Template.industries.helpers({
   getAvailableYears(){
    var years = new Array();

    for(i=2018; i>1970; i--){
      years.push(i);
    }
    return years;
  },
  getCompanyType(){
    var type = new Array();
    type.push("Agencia de Casting");
    type.push("Casa Productora");
    type.push("Festival");
    type.push("Renta de Equipo");
    return type;
  }
});


 Template.industries.events({
  'keyup #company_desc' : function(event){
   event.preventDefault();

   var len = $('#company_desc').val().length;
   if(len > 450){
    val.value= val.value.substring(0,450);
  }
  else{
    $('#max').text(450-len);
  }
},
'click #guardar_empresa': function(event, template) {

  console.log("En guardar empresa");
  event.preventDefault();
  var company_name = trimInput($('#company_name').val());
  var company_type = $('#company_type').val();
  var company_desc = trimInput($('#company_desc').val());
  var company_year = $('#company_year').val();
  var company_web_page = trimInput($('#company_web_page').val());
  var company_facebook_page = trimInput($('#facebook_page').val());
  var company_twitter_page = trimInput($('#twitter_page').val());
  var company_vimeo_page = trimInput($('#vimeo_page').val());
  var company_youtube_page = trimInput($('#youtube_page').val());
  var company_instagram_page = trimInput($('#instagram_page').val());

  if(isNotEmpty(company_name) && 
    isNotEmpty(company_type) && 
    isNotEmpty(company_desc) &&
    isNotEmpty(company_year)){
    Meteor.call(
     'insertCompany',
     Meteor.userId(),
     company_name,
     company_type,
     company_desc, 
     company_year,
     company_web_page,
     company_facebook_page,
     company_twitter_page,
     company_vimeo_page,
     company_youtube_page,
     company_instagram_page,
     function(err,result){
       if(!err){
        $.cloudinary.config({
          cloud_name:"drhowtsxb"
        });

        var options = {
          folder: Meteor.userId()
        };

        var file_logo = document.getElementById('company-logo-upload').files[0];
        var file_cover = document.getElementById('company-cover-upload').files[0];

        Cloudinary.upload(file_logo, options, function(err_logo,res_logo){
          if(!err_logo){
            Meteor.call(
              'saveCompanyLogoID',
              result,
              res_logo.public_id
            );
            Cloudinary.upload(file_cover, options, function(err_cover,res_cover){
              if(!err_cover){
                Meteor.call(
                  'saveCompanyCoverID',
                  result,
                  res_cover.public_id
                );

              }
              else{
                console.log("Upload Cover Error:"  + err); //no output on console
              }
            });
            
          }
          else{
              console.log("Upload Logo:"  + err); //no output on console
          }
        });
        Bert.alert({message: 'La empresa ha sido agregada', type: 'success', icon: 'fa fa-check'});
        //FlowRouter.go('/industryPage/' + result);       
      }
      else{
       console.log("Ocurrió el siguiente error: " +err);
     }
   }
   );


}
return false;
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