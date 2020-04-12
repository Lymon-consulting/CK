import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Media } from '../api/media.js';

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

Template.editIndustry.helpers({
  companyData(){
    if(Session.get("companyID")!=null){
      return Industry.findOne({'_id':Session.get("companyID")});
    }
  },
  getAvailableYears(){
    var years = new Array();

    for(i=2018; i>1970; i--){
      years.push(i);
    }
    return years;
  },
  getMedia(type) {
    Meteor.subscribe("allMedia");
    var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
    return media;
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
      var id = Meteor.call('addCompanyName',name,Meteor.userId(), function(error, response){
        if(!error){
          Session.set("companyID",response);
        }
      });
      
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
});

