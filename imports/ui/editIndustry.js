import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';
import { getParam } from '/lib/functions.js';

import './editIndustry.html';
import '/lib/common.js';


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

function formatURL(url){
  if(url!=""){
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;  
    }
  }
  return url;
}

Template.editIndustry.helpers({
  companyData(){
    if(Session.get("companyID")!=null){
      return Industry.findOne({'_id':Session.get("companyID")});
    }
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
  getMedia(type) {
    Meteor.subscribe("allMedia");
    var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    return media;
  },
  getGallery(){
    var data = Industry.findOne({'_id' : Session.get('companyID')});
    var array = new Array();
    
    if(data){
      if(data.gallery){
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
  getURL(mediaId){
    var url = "";
    var media = Media.findOne({'mediaId':mediaId});
      if(media!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + Meteor.userId() + "/" + media.mediaId;    
      }
    return url;
  },
  video(){
    var video = "";
    var data = Industry.findOne({'_id' : Session.get('companyID')});
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
    var company = Industry.findOne({'_id':Session.get('companyID')});
    var company_type="";
    if(company){
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
    var company = Industry.findOne({'_id':Session.get('companyID')});
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
    var company = Industry.findOne({'_id':Session.get('companyID')});
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
  var company = Industry.findOne({'_id':Session.get('companyID')});
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
  var company = Industry.findOne({'_id':Session.get('companyID')});
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
    var company = Industry.findOne({'_id':Session.get('companyID')});
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
    var company = Industry.findOne({'_id':Session.get('companyID')});
    if(company){
      if(company.company_desc!=null){
        result = company.company_desc.length;
      }
    }
    return result;
  },
  description(){
    var company = Industry.findOne({'_id':Session.get('companyID')});

    if(company){
      $('#max').text(Meteor.settings.public.MAX_CHAR_IN_TEXTAREA - company.company_desc.length);
      return company.company_desc;
    }
  },
  getIndustryLogo(size) {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : Session.get('companyID')});
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
    var data = Industry.findOne({'_id' : Session.get('companyID')});
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
    var data = Industry.findOne({'_id' : Session.get('companyID')});
    var gallery = new Array();
    var result="";
    if(data){
      if(data.gallery){
        gallery = data.gallery;
        for (var i = 0; i < gallery.length; i++) {
          if(mediaId===gallery[i]){
            result="checked";
            break;
          }
        }
      }
      
    }
    return result;
  }
});


Template.editIndustry.events({
  'keyup #company_desc' : function(event){
   event.preventDefault();

   var len = $('#company_desc').val().length;
   if(len > Meteor.settings.public.MAX_CHAR_IN_TEXTAREA){
    val.value= val.value.substring(0,Meteor.settings.public.MAX_CHAR_IN_TEXTAREA);
  }
  else{
    $('#max').text(Meteor.settings.public.MAX_CHAR_IN_TEXTAREA-len);
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
      if(Session.get("companyID")!=null){
        Meteor.call('updateCompanyName', Session.get("companyID"), name);
      }
    }
  },
  'change #company_type': function(event,template){
    event.preventDefault();
    var company_type = event.target.value;
    if(Session.get("companyID")!=null){
      if(company_type!="PRINCIPALES" && company_type!="SECUNDARIAS" && company_type.indexOf("---")<0 && company_type!=""){
        Meteor.call('updateCompanyType', Session.get("companyID"), company_type);
      }
    }
  },
  'change #company_desc': function(event,template){
    event.preventDefault();
    var company_desc = event.target.value;
    if(Session.get("companyID")!=null){
      if(isNotEmpty(company_desc)){
        Meteor.call('updateCompanyDesc',Session.get("companyID"), trimInput(company_desc));
      }
    }
  },
  'change #company_year': function(event,template){
    event.preventDefault();
    var company_year = event.target.value;
    if(Session.get("companyID")!=null){
      if(company_year!=null){
        Meteor.call('updateCompanyYear',Session.get("companyID"), company_year);
      }
    }
  },
  'change #company_web_page': function(event,template){
    event.preventDefault();
    var company_web_page = event.target.value;
    if(Session.get("companyID")!=null){
      if(isNotEmpty(company_web_page)){
        Meteor.call('updateCompanyWeb',Session.get("companyID"), company_web_page);
      }
    }
  },
  'change #facebook_page': function(event,template){
    event.preventDefault();
    var facebook_page = event.target.value;
    if(Session.get("companyID")!=null){
      if(isNotEmpty(facebook_page)){
        Meteor.call('updateCompanyFacebook',Session.get("companyID"), facebook_page);
      }
    }
  },
  'change #twitter_page': function(event,template){
    event.preventDefault();
    var twitter_page = event.target.value;
    if(Session.get("companyID")!=null){
      if(isNotEmpty(twitter_page)){
        Meteor.call('updateCompanyTwitter',Session.get("companyID"), twitter_page);
      }
    }
  },
  'change #vimeo_page': function(event,template){
    event.preventDefault();
    var vimeo_page = event.target.value;
    if(Session.get("companyID")!=null){
      if(isNotEmpty(vimeo_page)){
        Meteor.call('updateCompanyVimeo',Session.get("companyID"), vimeo_page);
      }
    }
  },
  'change #youtube_page': function(event,template){
    event.preventDefault();
    var youtube_page = event.target.value;
    if(Session.get("companyID")!=null){
      if(isNotEmpty(youtube_page)){
        Meteor.call('updateCompanyYoutube',Session.get("companyID"), youtube_page);
      }
    }
  },
  'change #instagram_page': function(event,template){
    event.preventDefault();
    var instagram_page = event.target.value;
    if(Session.get("companyID")!=null){
      if(isNotEmpty(instagram_page)){
        Meteor.call('updateCompanyInstagram',Session.get("companyID"), instagram_page);
      }
    }
  },
  'change #country': function(event,template){
    var country = trimInput(event.target.value);
    if(Session.get("companyID")!=null){
      Meteor.call('updateCompanyCountry', Session.get("companyID"), country);
      Session.set("selected_country", event.target.value);
    }
  },
  'change #states': function(event,template){
    var state = trimInput(event.target.value);
    if(Session.get("companyID")!=null){
      Meteor.call('updateCompanyState', Session.get("companyID"), state);
      Meteor.call('updateCompanyCountry', Session.get("companyID"), "México");
      Session.set("selected_state", state);
      var firstCity = City.findOne({'state': state}).city;
      Meteor.call('updateCompanyCity', Session.get("companyID"), firstCity);    
    }
  },
  'change #city': function(event,template){
    var city = trimInput(event.target.value);
    Meteor.call('updateCompanyCity', Session.get("companyID"), city);
    Meteor.call('updateCompanyCountry', Session.get("companyID"), "México");
  },
  'change #collaborator_section_title': function(event,template){
    var section_title = trimInput(event.target.value);
    Meteor.call('updateCompanyCollaboratorTitle', Session.get('companyID'), section_title);
  },
  'change #project_section_title': function(event,template){
    var project_title = trimInput(event.target.value);
    if(Session.get("companyID")!=null){
      Meteor.call('updateCompanyProjectTitle', Session.get('companyID'), project_title);  
    }
    
  },
  'click .goMediaLibrary': function(event,template){
    event.preventDefault();
    $('#modal1').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    FlowRouter.go("/mediaEditor/" + Meteor.userId());
  },
  'click #selectLogo': function(event,template){
     event.preventDefault();
     var mediaId = $(event.currentTarget).attr("data-id");
     console.log(mediaId);
     Meteor.call(
      'saveCompanyLogoID',
      Session.get('companyID'),
      mediaId
      );
      $('#modal1').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    },
    'click #selectCoverIndustry': function(event,template){
     event.preventDefault();
     var mediaId = $(event.currentTarget).attr("data-id");
     console.log(mediaId);
     Meteor.call(
      'saveCompanyCoverID',
      Session.get('companyID'),
      mediaId
      );
      $('#modal2').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    },
    'change .check':function(event,template){
      event.preventDefault();
      var mediaId = $(event.currentTarget).attr("data-id");
      if(event.target.checked){
        Meteor.call('addGallery',Session.get('companyID'), mediaId);
      }
      else{
        Meteor.call('removeGallery',Session.get('companyID'), mediaId); 
      }
    },
    'change #video': function(event,template){
      event.preventDefault();
      var video = trimInput(event.target.value);
      if(isNotEmpty(video)){
        if(video.indexOf("vimeo")>0){
          Meteor.call('updateVimeoForIndustry', Session.get('companyID'), formatURL(video)); 
          Meteor.call('updateYoutubeForIndustry', Session.get('companyID'), null); 
        } 
        else if(video.indexOf("youtube")>0){
          Meteor.call('updateYoutubeForIndustry', Session.get('companyID'), formatURL(video)); 
          Meteor.call('updateVimeoForIndustry', Session.get('companyID'), null); 
        }
        else{
          Bert.alert({message: 'Por el momento únicamente aceptamos videos de vimeo o youtube', type: 'danger', icon: 'fa fa-exclamation'});
        }
        
      }
      else{
        Meteor.call('updateYoutubeForIndustry', Session.get('companyID'), null); 
        Meteor.call('updateVimeoForIndustry', Session.get('companyID'), null); 
      }
    },
    
});

