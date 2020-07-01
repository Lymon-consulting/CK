import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';
import { getParam } from '/lib/functions.js';
import { uploadFiles } from '/lib/functions.js';
import { trimInput } from '/lib/functions.js';
import { isNotEmpty } from '/lib/functions.js';
import { formatURL } from '/lib/functions.js';

import './editIndustry.html';
import '/lib/common.js';

function isOwner(){
  var result = false;
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    if(data!=null && data.userId!=null){
      if(data.userId === Meteor.userId()){
        result = true;
      }
    }
    return result;
}

function isAdmin(){
  var result = false;
    var adminOfCompanies = Industry.find({'_id' : FlowRouter.getParam('id'), 'company_admin._id': Meteor.userId()}).fetch();
    if(adminOfCompanies!=null){
       result = true;
    }
    return result;
}

Template.editIndustry.helpers({
  isOwnerOrAdmin(){
    if(isOwner() || isAdmin()){
      return true;
    }
    else{
      return false;
    }

  },
  hasEditPermission(){
    var result = false;
    if(isOwner()){
      result=true;
    }
    else if(isAdmin()){
      result=false;
    }
    return result;
  },
  companyData(){    
    return Industry.findOne({'_id':FlowRouter.getParam("id")});    
  },
  getAvailableYears(){
    var years = new Array();
    var MIN_YEAR = getParam("MIN_YEAR");
    var MAX_YEAR = getParam("MAX_YEAR");
    for(i=MAX_YEAR; i>MIN_YEAR; i--){
      years.push(i);
    }
    return years;
  },
  getMedia() {
     Meteor.subscribe("allMedia");
    //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    var media = Media.find({'userId': Meteor.userId()},{sort:{'media_date':-1}});
    return media;
  },
  getGallery(){
    var data = Industry.findOne({'_id' : FlowRouter.getParam("id")});
    var array = new Array();
    
    if(data && data.gallery){
      if(data.gallery && data.gallery.length>0){
        for (var i = 0; i < data.gallery.length; i++) {
          var obj = {};
          obj.mediaId = data.gallery[i];

          if(i==0){
            obj.position = 1;
          }
          else{
            obj.position = 2;
          }
           array.push(obj);
          
        }
      }
    }
    return array;
/*
    var media = Media.find({"userId": Meteor.userId(), "media_use":"gallery"}).fetch();
    var array = new Array();
    if(media){
      array = media;
      for (var i = 0; i < array.length; i++) {
        if(i==0){
          array[i].position = 1;
        }
        else{
          array[i].position = 2;
        }
      }
    }
    return array;*/
  },
  isFirstElement(position){
    var result = false;
    if(position==1){
      result = true;
    }
    else{
      result = false;
    }
    return result;
  },
  hasMedia() {
    Meteor.subscribe("allMedia");
    //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    var media = Media.find({'userId': Meteor.userId()}).count();
    var hasMedia = false;
    if(media > 0){
      hasMedia = true;
    }
    return hasMedia;
  },
  getURL(mediaId){
    var url = "";
    var media = Media.findOne({'mediaId':mediaId});
      if(media!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + media.userId + "/" + media.mediaId;    
      }
    return url;
  },
  video(){
    var video = "";
    var data = Industry.findOne({'_id' : FlowRouter.getParam("id")});
    if(data){
      if(data.vimeo){
        video = data.vimeo;
      }
      else if(data.youtube){
        video = data.youtube;
      } 
    }
    return video;
  },
  getCompanyType(){
    var type = new Array();
    type.push("");
    type.push("PRINCIPALES");
    type.push("-----------");
    type.push("Agencia de casting");
    type.push("Catering");
    type.push("Bodega de arte");
    type.push("Bodega de vestuario");
    type.push("Canal de television");
    type.push("Casa productora");
    type.push("Casa post–productora (Imagen)");
    type.push("Casa post-productora (Audio)");
    type.push("Compañía teatral");
    type.push("Distribuidora");
    type.push("Escuelas (Cine/ medios audiovisuales)");
    type.push("Estudio de animacion");
    type.push("Estudio de grabacion");
    type.push("Exhibicion (Cine/espacios )");
    type.push("Festivales de cine");
    type.push("Musicalizacion");
    type.push("Renta de equipo");
    type.push("Renta de foro");
    type.push("Renta picture cars");
    type.push("");
    type.push("SECUNDARIAS");
    type.push("-----------");
    type.push("Agencia de extras");
    type.push("Agencia de modelos");
    type.push("Agencia de publicidad");
    type.push("Agencia fotográfica");
    type.push("Animales adiestrados para cine y televisión");
    type.push("Armero para cine y televisión");
    type.push("Aseguradora para cine y televisión");
    type.push("Baños portatiles");
    type.push("Contabilidad");
    type.push("Copywriter");
    type.push("Despacho legal");
    type.push("Diseño web");
    type.push("Diseño grafico (Posters, postales ,tipografia)");
    type.push("Doblaje");
    type.push("Drone/ Fotografía aerea");
    type.push("Editorial");
    type.push("Efectos especiales (Explosiones)");
    type.push("Estación de radio");
    type.push("Estudio de grabación (Música)");
    type.push("Estudio de grabacion (Audio/ follys/ etc)");
    type.push("Locaciones");
    type.push("Maquillaje y peinados");
    type.push("Plantas de luz");
    type.push("Utilería y props");
    type.push("Relaciones públicas");
    type.push("Renta de campers");
    type.push("Renta de transporte ( Vans/ camiones)");
    type.push("Renta de video assist");
    type.push("Stunts");
    type.push("Servicio de subtitulaje");
    type.push("Viveros");
    return type;
  },
  typeSelected: function(value){
    var result="";
    var company = Industry.findOne({'_id': FlowRouter.getParam("id")});
    var company_type="";
    if(company && company.company_type){
      company_type = company.company_type.trim();
      if(company_type!="" && value!=""){
        var elem = company_type.indexOf(value.trim());
        if(elem >= 0){
          result = 'selected';
        }
        else{
          result = "";
        } 
      }
    }
    return result;
  },
  yearSelected: function(value){
    var result="";
    var company = Industry.findOne({'_id': FlowRouter.getParam("id")});
    var year="";
    if(company){
      year = company.company_year;
      if(year!=null && year!="" && value!=""){
        var elem = year.indexOf(value);
        if(elem >= 0){
          result = 'selected';
        }
        else{
          result = "";
        } 
      }
    }
    return result;
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
    var company = Industry.findOne({'_id':FlowRouter.getParam("id")});
    if(Session.get("selected_state")!=null){
      return City.find({'state': Session.get("selected_state")}).fetch();
    }
    else{
      if(company!=null && company.state!=null){
        return City.find({'state': company.state}).fetch();    
      }
      else{
        return City.find({'state': 'Aguascalientes'}).fetch();    
      }
    }
  },
  citySelected: function(value){
  var result="";
  var company = Industry.findOne({'_id': FlowRouter.getParam("id")});
  if(company){
    if(value!="" && company.city!=null){
      var city = company.city.trim();
      var elem = city.indexOf(value.trim());
      if(city.trim()===value.trim()){
        result = 'selected';
      }
      else{
        result = "";
      } 
    }
  }
 return result;
},
stateSelected: function(value){
  var result="";
  var company = Industry.findOne({'_id': FlowRouter.getParam("id")});
  if(company){
    if(value!="" && company.state!=null){
      var state = company.state.trim();
      var elem = state.indexOf(value.trim());
      if(elem >= 0){
        result = 'selected';
      }
      else{
        result = "";
      } 
    }
  }
  return result;
},
  countrySelected: function(value){
    var result="";
    var company = Industry.findOne({'_id': FlowRouter.getParam("id")});
    if(company){
      if(company.country!=null && value!=""){
        var country = company.country.trim();
        var elem = country.indexOf(value.trim());
        if(elem >= 0){
          result = 'selected';
        }
        else{
          result = "";
        }   
      }
    }
   return result;
  },
  resumeCount(){
    var result=0;
    var company = Industry.findOne({'_id': FlowRouter.getParam("id")});
    if(company){
      if(company.company_desc!=null && company.company_desc!=""){
        result = company.company_desc.length;
      }
    }
    return result;
  },
  description(){
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    var resume="";
    var MAX_CHAR_IN_TEXTAREA = getParam("MAX_CHAR_IN_TEXTAREA");
    if(data!=null && data.company_desc!=null){
      resume = data.company_desc;
      $('#max').text(MAX_CHAR_IN_TEXTAREA - resume.length);
    }
    else{
      $('#max').text(MAX_CHAR_IN_TEXTAREA); 
    }
    return resume;
  },
  getIndustryLogo(size) {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : FlowRouter.getParam("id")});
    var url;
    if(data!=null && data.companyLogoID!=null){
      var cover = Media.findOne({'mediaId':data.companyLogoID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_fill/" + "/v" + cover.media_version + "/" + data.userId + "/" + data.companyLogoID;    
      }
      
    }
    return url;
  },
  getCoverPicture() {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : FlowRouter.getParam("id")});
    var url;
    if(data!=null && data.companyCoverID!=null){
      var cover = Media.findOne({'mediaId':data.companyCoverID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_1200,h_250,c_fill/" + "/v" + cover.media_version + "/" + data.userId + "/" + data.companyCoverID;    
      }
      
    }
    return url;
  },
  verifyChecked(mediaId){
    var data = Industry.findOne({'_id' : FlowRouter.getParam("id")});
    var gallery = new Array();
    var result="";
    if(data){
      if(data.gallery){
        gallery = data.gallery;
        if(gallery && gallery.length>0){
          for (var i = 0; i < gallery.length; i++) {
            if(mediaId===gallery[i]){
              result="checked";
              break;
            }
          }
        }
      }
      
    }
    return result;
  },
  maxLength(){
    return getParam("MAX_CHAR_IN_TEXTAREA");
  }
});


Template.editIndustry.events({
  'keyup #company_desc' : function(event){
   event.preventDefault();
   var len = $('#company_desc').val().length;
   if(len > getParam("MAX_CHAR_IN_TEXTAREA")){
    val.value= val.value.substring(0,getParam("MAX_CHAR_IN_TEXTAREA"));
  }
  else{
    $('#max').text(getParam("MAX_CHAR_IN_TEXTAREA")-len);
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
   });
  }
  return false;
  },
  'change #company_name': function(event,template){
    event.preventDefault();
    var name = "";
    if(isNotEmpty(event.target.value)){
      name = trimInput(event.target.value);
      Meteor.call('updateCompanyName', FlowRouter.getParam("id"), name);      
    }
  },
  'change #company_type': function(event,template){
    event.preventDefault();
    var company_type = event.target.value;
      if(company_type!="PRINCIPALES" && company_type!="SECUNDARIAS" && company_type.indexOf("---")<0 && company_type!=""){
        /*var type;
        var company = Industry.findOne({'_id':FlowRouter.getParam('id')});
        if(company){
          type = company.company_type;
        }*/



        Meteor.call('updateCompanyType', FlowRouter.getParam("id"), company_type);
      }
  },
  'change #company_desc': function(event,template){
    event.preventDefault();
    var company_desc = event.target.value;    
      if(isNotEmpty(company_desc)){
        Meteor.call('updateCompanyDesc', FlowRouter.getParam("id"), trimInput(company_desc));
      }    
  },
  'change #company_year': function(event,template){
    event.preventDefault();
    var company_year = event.target.value;    
      if(company_year!=null){
        Meteor.call('updateCompanyYear', FlowRouter.getParam("id"), company_year);
      }    
  },
  'change #company_web_page': function(event,template){
    event.preventDefault();
    var company_web_page = event.target.value;    
      if(isNotEmpty(company_web_page)){
        Meteor.call('updateCompanyWeb', FlowRouter.getParam("id"), company_web_page);
      }    
  },
  'change #facebook_page': function(event,template){
    event.preventDefault();
    var facebook_page = event.target.value;    
      if(isNotEmpty(facebook_page)){
        Meteor.call('updateCompanyFacebook', FlowRouter.getParam("id"), facebook_page);
      }    
  },
  'change #twitter_page': function(event,template){
    event.preventDefault();
    var twitter_page = event.target.value;    
      if(isNotEmpty(twitter_page)){
        Meteor.call('updateCompanyTwitter', FlowRouter.getParam("id"), twitter_page);
      }
  },
  'change #vimeo_page': function(event,template){
    event.preventDefault();
    var vimeo_page = event.target.value;
      if(isNotEmpty(vimeo_page)){
        Meteor.call('updateCompanyVimeo', FlowRouter.getParam("id"), vimeo_page);
      }    
  },
  'change #youtube_page': function(event,template){
    event.preventDefault();
    var youtube_page = event.target.value;  
      if(isNotEmpty(youtube_page)){
        Meteor.call('updateCompanyYoutube', FlowRouter.getParam("id"), youtube_page);
      }    
  },
  'change #instagram_page': function(event,template){
    event.preventDefault();
    var instagram_page = event.target.value;    
      if(isNotEmpty(instagram_page)){
        Meteor.call('updateCompanyInstagram', FlowRouter.getParam("id"), instagram_page);
      }    
  },
  'change #country': function(event,template){
    var country = trimInput(event.target.value);    
    Meteor.call('updateCompanyCountry', FlowRouter.getParam("id"), country);
    Session.set("selected_country", event.target.value);    
  },
  'change #states': function(event,template){
    var state = trimInput(event.target.value);
    
    Meteor.call('updateCompanyState', FlowRouter.getParam("id"), state);
    Meteor.call('updateCompanyCountry', FlowRouter.getParam("id"), "México");
    Session.set("selected_state", state);
    var firstCity = City.findOne({'state': state}).city;
    Meteor.call('updateCompanyCity', FlowRouter.getParam("id"), firstCity);    
    
  },
  'change #city': function(event,template){
    var city = trimInput(event.target.value);
    Meteor.call('updateCompanyCity', FlowRouter.getParam("id"), city);
    Meteor.call('updateCompanyCountry', FlowRouter.getParam("id"), "México");
  },
  'change #collaborator_section_title': function(event,template){
    var section_title = trimInput(event.target.value);
    Meteor.call('updateCompanyCollaboratorTitle', FlowRouter.getParam("id"), section_title);
  },
  'change #project_section_title': function(event,template){
    var project_title = trimInput(event.target.value);   
    Meteor.call('updateCompanyProjectTitle', FlowRouter.getParam("id"), project_title);          
  },
  'click .goMediaLibraryLogo': function(event,template){
    event.preventDefault();
    $('#modal1').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/industry/"+FlowRouter.getParam("id")+"/logo");
  },
  'click .goMediaLibraryCover': function(event,template){
    event.preventDefault();
    $('#modal2').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/industry/"+FlowRouter.getParam("id")+"/cover");
  },
  'click .goMediaLibraryGallery': function(event,template){
    event.preventDefault();
    $('#modal3').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+"/industry/"+FlowRouter.getParam("id")+"/gallery");
  },
  'click #openMediaGallery': function(event,template){
    event.preventDefault();
    $(".media-thumb").css('border','none');
    $("#setLogo").addClass('disabled');
    $('#modal1').modal('show');
  },
  'click #openMediaCover': function(event,template){
    event.preventDefault();
    $(".media-thumb").css('border','none');
    $("#setCoverPicture").addClass('disabled');
    $('#modal2').modal('show');
  },
  'click #selectLogo': function(event,template){
      event.preventDefault();
      var mediaId = $(event.currentTarget).attr("data-id");

      Session.set("mediaId",mediaId);

     $(".media-thumb").css('border','none');
     $(event.target).css('border', "solid 3px #ED1567");
     $("#setLogo").removeClass('disabled');
    },
    'click #setLogo': function(event,template){
     event.preventDefault();
     var mediaId = Session.get("mediaId");

     Meteor.call(
      'saveCompanyLogoID',
      FlowRouter.getParam("id"),
      mediaId
      );

      $('#modal1').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();

    },
    'click #selectCoverIndustry': function(event,template){
     event.preventDefault();
     var mediaId = $(event.currentTarget).attr("data-id");     
     Meteor.call(
      'saveCompanyCoverID',
      FlowRouter.getParam("id"),
      mediaId
      );
      $('#modal2').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    },
    'click #selectCoverPicture': function(event,template){
     event.preventDefault();
      var mediaId = $(event.currentTarget).attr("data-id");

      Session.set("mediaId",mediaId);

     $(".media-thumb").css('border','none');
     $(event.target).css('border', "solid 3px #ED1567");
     $("#setCoverPicture").removeClass('disabled');

    },
    'click #setCoverPicture': function(event,template){
     event.preventDefault();
     var mediaId = Session.get("mediaId");

     Meteor.call(
      'saveCompanyCoverID',
      FlowRouter.getParam("id"),
      mediaId
      );

      $('#modal2').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      $("#setCoverPicture").removeClass('disabled');

    },
    'change .check':function(event,template){
      event.preventDefault();
      var mediaId = $(event.currentTarget).attr("data-id");
      if(event.target.checked){
        Meteor.call('addGallery', FlowRouter.getParam("id"), mediaId);
      }
      else{
        Meteor.call('removeGallery', FlowRouter.getParam("id"), mediaId); 
      }
    },
    'change #video': function(event,template){
      event.preventDefault();
      var video = trimInput(event.target.value);
      if(event.target.value!=""){
        if(isNotEmpty(video)){
          if(video.indexOf("vimeo")>0){
            Meteor.call('updateVimeoForIndustry', FlowRouter.getParam("id"), formatURL(video)); 
            Meteor.call('updateYoutubeForIndustry', FlowRouter.getParam("id"), null); 
          } 
          else if(video.indexOf("youtube")>0){
            Meteor.call('updateYoutubeForIndustry', FlowRouter.getParam("id"), formatURL(video)); 
            Meteor.call('updateVimeoForIndustry', FlowRouter.getParam("id"), null); 
          }
          else{
            Bert.alert({message: 'Por el momento únicamente aceptamos videos de vimeo o youtube', type: 'danger', icon: 'fa fa-exclamation'});
          }
          
        }
        else{
          Meteor.call('updateYoutubeForIndustry', FlowRouter.getParam("id"), null); 
          Meteor.call('updateVimeoForIndustry', FlowRouter.getParam("id"), null); 
        }
      }
    },
    'change [type="file"]': function(e, t) {
        //console.log(e.target.name);
        uploadFiles(e.target.files, this._id, e.target.name);
        /*
        $('#modal1').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();*/
      },


    
});

