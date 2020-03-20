import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Ocupation } from '../api/ocupations.js';
import { Media } from '../api/media.js';

import './editIndustry.html';
import '/lib/common.js';


if (Meteor.isClient) {
 Meteor.subscribe("fileUploads");



 Template.editIndustries.helpers({
  companyData(){
    return Industry.findOne({'_id': FlowRouter.getParam('id')});
  },
  typeSelected: function(value, company_type){
    var ptype = company_type;
    return (ptype === value) ? 'selected' : '' ;
  },
  yearSelected: function(value, company_year){
    var pyear = company_year;
    return (pyear == value) ? 'selected' : '' ;
  },
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
  },
  getIndustryLogo() {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    var url;
    if(data!=null && data.companyLogoID!=null){
      var cover = Media.findOne({'mediaId':data.companyLogoID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_250,c_scale" + "/v" + cover.media_version + "/" + Meteor.userId() + "/" + data.companyLogoID;    
      }
      
    }
    return url;
    /*
    var url = "";
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null && data.companyLogoID!=null){
      url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_250,c_scale/" + data.companyLogoID;
    }
    return url;*/
  },
  getLogoPublicID(){
    var companyLogoID="";
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null){
      companyLogoID = data.companyLogoID;
    }

    return companyLogoID;
    
  },
  getIndustryCover() {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    var url;
    if(data!=null && data.companyCoverID!=null){
      var cover = Media.findOne({'mediaId':data.companyCoverID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_250,c_scale" + "/v" + cover.media_version + "/" + Meteor.userId() + "/" + data.companyCoverID;    
      }
      
    }
    return url;
    /*
    var url = "";
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null && data.companyCoverID!=null){
      url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_250,c_scale/" + data.companyCoverID;
    }
    return url;*/
  },
  getMedia(type) {
    Meteor.subscribe("allMedia");
    var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    return media;
  },
  getCoverPublicID(){
    var companyCoverID="";
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null){
      companyCoverID = data.companyCoverID;
    }

    return companyCoverID;
    
  },
  resumeCount(data){
    var result = 0;
    if(data!=null && data.length!=null){
      result = (450 - data.length);
    }
    return result;
   }
});


 Template.editIndustries.events({
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
     'updateCompany',
     FlowRouter.getParam('id'),
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
        Bert.alert({message: 'Los datos de la empresa han sido modificados', type: 'success', icon: 'fa fa-check'});
        FlowRouter.go('/industryPage/' + FlowRouter.getParam('id'));
      }
      else{
       console.log("Ocurrió el siguiente error: " +err);
     }
   }
   );


}
return false;
},
'change #company-logo-upload': function(event, template){
  var file = event.target.files[0];

  $.cloudinary.config({
    cloud_name:"drhowtsxb"
  });

  var options = {
    folder: Meteor.userId()
  };

  Cloudinary.upload(file, options, function(err,res_logo){
    if(!err){
      Meteor.call(
        'saveCompanyLogoID',
        FlowRouter.getParam('id'),
        res_logo.public_id
      );
    }
    else{
      console.log("Upload Error:"  + err); //no output on console
    }
  });
},
'click #deleteLogoButton ': function (event) {
     //console.log("deleteFile button ", this);
     event.preventDefault();
     if(confirm("¿Eliminar logo de empresa?")){
        //Cover.remove({_id:this._id}); 
         var public_id = $(event.target).attr('data-id');
         console.log("Borrando "+ public_id);
         console.log(Cloudinary);
         Cloudinary.delete(public_id,function(res){
           console.log(res);
         });
         Meteor.call(
          'deleteCompanyLogo',
          FlowRouter.getParam('id'),
          public_id
          );
     }
     
  },
  'change #company-cover-upload': function(event, template){
  var file = event.target.files[0];

  $.cloudinary.config({
    cloud_name:"drhowtsxb"
  });

  var options = {
    folder: Meteor.userId()
  };

  Cloudinary.upload(file, options, function(err,res_cover){
    if(!err){
      Meteor.call(
        'saveCompanyCoverID',
        FlowRouter.getParam('id'),
        res_cover.public_id
      );
    }
    else{
      console.log("Upload Error:"  + err); //no output on console
    }
  });
},
  'click #deleteCoverButton ': function (event) {
     //console.log("deleteFile button ", this);
     event.preventDefault();
     if(confirm("¿Eliminar foto de portada?")){
        //Cover.remove({_id:this._id}); 
         var public_id = $(event.target).attr('data-id');
         console.log("Borrando "+ public_id);
         console.log(Cloudinary);
         Cloudinary.delete(public_id,function(res){
           console.log(res);
         });
         Meteor.call(
          'deleteCompanyCover',
          FlowRouter.getParam('id'),
          public_id
          );
     }
     
  },
  'click .goMediaLibrary': function(event,template){
    event.preventDefault();
    $('.modal').modal('hide'); 
    $('.modal-backdrop').remove();
    FlowRouter.go("/mediaEditor/" + Meteor.userId());
  },

  'click #selectLogo': function(event,template){
     event.preventDefault();
     var mediaId = $(event.currentTarget).attr("data-id");

     Meteor.call(
        'saveCompanyLogoID',
        FlowRouter.getParam('id'),
        mediaId
      );

    $('.modal').modal('hide'); 
    $('.modal-backdrop').remove();

  },
  'click #selectCoverIndustry': function(event,template){
     event.preventDefault();
     var mediaId = $(event.currentTarget).attr("data-id");

     Meteor.call(
        'saveCompanyCoverID',
        FlowRouter.getParam('id'),
        mediaId
      );

    $('.modal').modal('hide'); 
    $('.modal-backdrop').remove();

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