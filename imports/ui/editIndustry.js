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
  Meteor.subscribe("myIndustries");
  var result = false;
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    if(data.creator === Meteor.userId()){
      result = true;
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

let myCarousel; //a variable thats hold owlCarousel object
function myCarouselStart() {
    myCarousel = $('#my-carousel.owl-carousel').owlCarousel({
     items:1,
     nav:false
    });
}


mediaSub = Meteor.subscribe("myIndustries");

Template.editIndustry.rendered = function(){
  var _this = this;
  this.autorun(function(c) {

    setTimeout(() => {  

      $(document).ready(() => {
          myCarouselStart(); // run owl carousel for first time
      });
    
/*
    if (mediaSub.ready()) {
      var owl = _this.$(".owl-carousel");
      owl.owlCarousel({
         
         items:1,
         nav:false
      });
      c.stop();
    }*/

    


    }, 2000);

    window.scrollTo(0,0);

  });
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
  isCreator(){
    return isOwner();
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
    var media = Media.find({'companyId': FlowRouter.getParam("id")},{sort:{'media_date':-1}});
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
    var media = Media.find({'companyId': FlowRouter.getParam("id")}).count();
    console.log(media);
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
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + Meteor.settings.public.LEVEL + "/" + media.mediaId;    
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
  videoDisplay(){
    var video = "";
    var data = Industry.findOne({'_id' : FlowRouter.getParam("id")});
    if(data){
      if(data.vimeo){
        video = data.vimeo;
        var vimeoVideoID = video.substring(video.indexOf(".com/")+5, video.length);
        url = "https://player.vimeo.com/video/" + vimeoVideoID+"?portrait=0";
      }
      else if(data.youtube){
        video = data.youtube;
        var youtubeVideoID = video.substring(video.indexOf("?v=")+3, video.length);
        url = "https://www.youtube.com/embed/" + youtubeVideoID;
      } 
    }
    return url;
  },
  getCompanyType(){
    var type = new Array();
    type.push("");
    type.push("PRINCIPALES");
    type.push("-----------");
    type.push("Agencia de casting");
    type.push("Agencia de publicidad ");
    type.push("Agencia de representación/ management ");
    type.push("Agencia y/o estudio doblaje/ locutores ");
    type.push("Asociación/ Organización/ Redes ");
    type.push("Bodega de arte");
    type.push("Bodega de vestuario");
    type.push("Cámaras empresariales cine y televisión");
    type.push("Canal de televisión");
    type.push("Casa post-productora (Audio)");
    type.push("Casa post-productora (Imagen)");
    type.push("Casa productora");
    type.push("Catering");
    type.push("Comisiones de filmación ");
    type.push("Distribuidora");
    type.push("Escuelas (Cine/ Medios audiovisuales)");
    type.push("Estudio de animación");
    type.push("Exhibición (Salas/ Cineclubs/ Espacios )");
    type.push("Festivales / Muestras de cine");
    type.push("Grupo Gaffer/ Staff/ Electrico ");
    type.push("Institución de gobierno");
    type.push("Locaciones");
    type.push("Musicalización/ Musica original ");
    type.push("Plataforma de streaming");
    type.push("Renta de equipo");
    type.push("Renta de equipo (audio)");
    type.push("Renta de foro/ set");
    type.push("Servicios de producción");
    type.push("Sindicatos");

    type.push("");
    type.push("SECUNDARIAS");
    type.push("-----------");
    type.push("Agencia aduanal/ logistica cine");
    type.push("Agencia de extras");
    type.push("Agencia de investigación de mercado (Cine/ publicidad)");
    type.push("Agencia de modelos");
    type.push("Agencia de trailers");
    type.push("Agencia financiera producciones audiovisuales");
    type.push("Agencia marketing cine");
    type.push("Animal wrangler");
    type.push("Armas para producciones audiovisuales");
    type.push("Aseguradora/ seguros producciones audiovisuales");
    type.push("Book actores (Servicios foto y video)");
    type.push("Colectivo/ Laboratorio cinematografico");
    type.push("Compañía baile para producciones audiovisuales");
    type.push("Compañía/ Asociación teatral");
    type.push("Contabilidad para producciones audiovisuales");
    type.push("Copywriter");
    type.push("Derechos/ copyright musical");
    type.push("Desarrollo de carpetas");
    type.push("Despacho/ Asesoría legal");
    type.push("Diseño gráfico (Posters, postales ,tipografia)");
    type.push("Diseño web ");
    type.push("Disfraces y pelucas");
    type.push("Drone/ Fotografía aérea");
    type.push("Dummies");
    type.push("Efectos caracterización (maquillaje, prostéticos, botargas)");
    type.push("Efectos SFX (Efectos especiales onset. Explosiones/ lluvia/ etc)  ");
    type.push("Efectos VFX/ CGI/ Motion  ");
    type.push("Escuela de actuación");
    type.push("Escuela de animación");
    type.push("Estudio creativo/ Art direction");
    type.push("Estudio de fotografía");
    type.push("Estudio de grabación (Música/ audio/ follys/ etc)");
    type.push("Fondos/ Premios/ Residencias/ Talleres");
    type.push("Helicópteros para producciones audiovisuales");
    type.push("Jardinería cinematográfica (Greensman)");
    type.push("Jingles");
    type.push("Laboratorio/ Revelado fotográfico");
    type.push("Limpieza/ Sanitización set");
    type.push("Maquetas para producciones audiovisuales");
    type.push("Provedores luces cinematograficas");
    type.push("Proveedores equipo de audio");
    type.push("Proveedores expendables");
    type.push("Proveedores material cinematográfico (Celuloide)");
    type.push("Proveedores material maquillaje y peinados");
    type.push("Proveedores vídeo y fotografía");
    type.push("Realidad virtual");
    type.push("Renta de campers");
    type.push("Renta de equipo especializado");
    type.push("Renta de pipas agua");
    type.push("Renta de transporte (Vans/ camionetas)");
    type.push("Renta de video assist / DIT");
    type.push("Renta de walkie talkie (radio comunicación)");
    type.push("Renta picture cars");
    type.push("Renta plantas de luz / generadores");
    type.push("Renta sanitarios moviles");
    type.push("Reproducciones");
    type.push("Revista/ Blogs/ Podcasts de cine");
    type.push("Seguridad/ Vigilancia set");
    type.push("Servicio de subtitulaje/ traducción");
    type.push("Servicios edicion");
    type.push("Servicios escritura guión/ script doctor");
    type.push("Servicios grabación sonido directo");
    type.push("Servicios streaming/ transmisión");
    type.push("Stock video y foto/ Archivo fílmico");
    type.push("Storyboard");
    type.push("Stunts");
    type.push("Video 360");
    type.push("Video mapping");
    return type;
  },
  statusPublished(){
    return Industry.findOne({'_id': FlowRouter.getParam('id')}).status;
  },
  getBusinessTypeSelected(){  

  var result = new Array();
  var company = Industry.findOne({'_id': FlowRouter.getParam("id")});
  //console.log(userRoles);
  if(company && company.company_type){
    for (var i = 0; i < company.company_type.length; i++) {
      result.push(company.company_type[i]);
    }
  }
  //console.log(result);
  return result;
},
  typeSelected: function(value){
    var result="";
    var company = Industry.findOne({'_id': FlowRouter.getParam("id")});
    var company_type="";
    if(company && company.company_type){
      for (var i = 0; i < company.company_type.length; i++) {
        if(value === company.company_type[i]){
          result = 'selected';
          break;
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
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_fill" + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.companyLogoID;
      }
      
    }

    //https://res.cloudinary.com/drhowtsxb/image/upload/w_80,c_fill//v1618683694/development/undefined/company/L9pf5PLPK5LGGn7Yd/wzymgoghihnqidwhmowu
    //https://res.cloudinary.com/drhowtsxb/image/upload             /v1618683694/development/company/L9pf5PLPK5LGGn7Yd/wzymgoghihnqidwhmowu.jpg

    return url;
  },
  getCoverPicture() {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : FlowRouter.getParam("id")});
    var url;
    if(data!=null && data.companyCoverID!=null){
      var cover = Media.findOne({'mediaId':data.companyCoverID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_1200,h_250,c_fill" + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.companyCoverID;
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
'click .save': function(event, template) {
  event.preventDefault();
  
  /*Verificar qué botón oprimió*/
  var button = $(event.currentTarget).attr("publish");

  /*Validar datos obligatorios*/
  var company_name = trimInput($('#company_name').val());
  var company_desc = trimInput($('#company_desc').val());
  var company_year = $('#company_year').val();
  var country = $('#country').val();
  var state = $('#states').val();
  var city = $('#city').val();

  var company_type = new Array();
  $('select#selection').find('option').each(function() {
      company_type.push($(this).val());
  });


  if(!isNotEmpty(company_name)){
    Bert.alert({message: 'Por favor rellena el nombre de la empresa u organización', type: 'error', icon: 'fa fa-times'});
  }
  else if(company_type==null || company_type.length<=0){
    Bert.alert({message: 'Por favor selecciona el tipo de empresa u organización', type: 'error', icon: 'fa fa-times'});
  }
  else if(!isNotEmpty(company_desc)){
    Bert.alert({message: 'Por favor agrega una descripción', type: 'error', icon: 'fa fa-times'});
  }
  else if(!isNotEmpty(company_year)){
    Bert.alert({message: 'Por favor selecciona el año de fundación', type: 'error', icon: 'fa fa-times'});
  }
  else{
    var status = false;
    var msg = "";
    if(button==="true"){
      status = true;
      msg = "Los datos de tu empresa u organización han sido actualizados y ahora se encuentra publicado";
    }
    else if(button==="false"){
      status = false;
      msg="Los datos de tu empresa u organización han sido actualizados, se ha guardado como borrador";
    }
    var company_web_page = trimInput($('#company_web_page').val());
    var company_facebook_page = trimInput($('#facebook_page').val());
    var company_twitter_page = trimInput($('#twitter_page').val());
    var company_vimeo_page = trimInput($('#vimeo_page').val());
    var company_youtube_page = trimInput($('#youtube_page').val());
    var company_instagram_page = trimInput($('#instagram_page').val());
    var video = trimInput($('#video').val());

    Meteor.call('updateYoutubeForIndustry', FlowRouter.getParam("id"), null);
    Meteor.call('updateVimeoForIndustry', FlowRouter.getParam("id"), null);  

    if(video!=null && video!=""){
      
      if(video.indexOf("vimeo")>0){
        Meteor.call('updateVimeoForIndustry', FlowRouter.getParam("id"), formatURL(video)); 
      } 
      else if(video.indexOf("youtube")>0){
        Meteor.call('updateYoutubeForIndustry', FlowRouter.getParam("id"), formatURL(video)); 
      }
      else{
        Bert.alert({message: 'Por el momento únicamente aceptamos videos de vimeo o youtube', type: 'danger', icon: 'fa fa-exclamation'});
      }  
    }
    

    Meteor.call(
     'updateCompany',
     FlowRouter.getParam('id'),
     company_name,
     company_desc,
     company_year,
     company_web_page,
     company_facebook_page,
     company_twitter_page,
     company_vimeo_page,
     company_youtube_page,
     company_instagram_page,
     status
     );
    
    Meteor.call('updateCompanyCountry', FlowRouter.getParam("id"), country);
    Meteor.call('updateCompanyState', FlowRouter.getParam("id"), state);
    Meteor.call('updateCompanyCity', FlowRouter.getParam("id"), city);
    
    Bert.alert({message: msg, type: 'success', icon: 'fa fa-check'});

  }

  



  
  return false;
  },
  /*
  'change #company_name': function(event,template){
    event.preventDefault();
    var name = "";
    if(isNotEmpty(event.target.value)){
      name = trimInput(event.target.value);
      Meteor.call('updateCompanyName', FlowRouter.getParam("id"), name);      
    }
  },*/
  'click #company_type': function(event,template){
    event.preventDefault();
    var company_type = event.currentTarget.value;
    if(company_type!="PRINCIPALES" && company_type!="SECUNDARIAS" && company_type.indexOf("---")<0 && company_type!=""){
      Meteor.call('addCompanyType', FlowRouter.getParam("id"), company_type);
    }
  },
  'click #selection':function(event, template){
     event.preventDefault();
     Meteor.call(
      'removeCompanyType',
      FlowRouter.getParam("id"),
      event.currentTarget.value
      )
   },/*
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
  },*/
  'change #country': function(event,template){
    var country = trimInput(event.target.value);    
    //Meteor.call('updateCompanyCountry', FlowRouter.getParam("id"), country);
    Session.set("selected_country", event.target.value);    
  },
  'change #states': function(event,template){
    var state = trimInput(event.target.value);
    
    /*Meteor.call('updateCompanyState', FlowRouter.getParam("id"), state);
    Meteor.call('updateCompanyCountry', FlowRouter.getParam("id"), "México");*/
    Session.set("selected_state", state);
    /*var firstCity = City.findOne({'state': state}).city;
    Meteor.call('updateCompanyCity', FlowRouter.getParam("id"), firstCity);    */
    
  },
  'change #city': function(event,template){
    /*var city = trimInput(event.target.value);
    Meteor.call('updateCompanyCity', FlowRouter.getParam("id"), city);
    Meteor.call('updateCompanyCountry', FlowRouter.getParam("id"), "México");*/
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
       
      console.log("Llamando myCarousel");

      $("#my-carousel").html("");
       myCarousel.trigger("destroy.owl.carousel");
      

      if(event.target.checked){
        Meteor.call('addGallery', FlowRouter.getParam("id"), mediaId);

      }
      else{
        Meteor.call('removeGallery', FlowRouter.getParam("id"), mediaId); 
      }
       
 /*
      var url = "";
      var media;

       var data = Industry.findOne({'_id' : FlowRouter.getParam("id")});
       var htmlConstructor = "";
       for (var i = data.gallery.length - 1; i >= 0; i--) {
         media = Media.findOne({'mediaId':mediaId});
         url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.gallery[i];
         htmlConstructor += "<div> <img class='d-block w-50' src='"+ url +"'> </div>";
         
       }


       console.log(htmlConstructor);
       $("#my-carousel").html(htmlConstructor);*/
       myCarouselStart();
       console.log("Otra vez el start");
      

    },
    /*
    'change #video': function(event,template){
      event.preventDefault();
      var video = trimInput(event.target.value);
      if(event.target.value!=""){
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
    },*/
    'change [type="file"]': function(e, t) {
        uploadFiles(e.target.files, FlowRouter.getParam("id"), 2);
      },
    'click #deleteIndustry': function(event,Template){
      event.preventDefault();
      if(confirm("Estas a punto de eliminar esta empresa, esta acción no se puede deshacer, ¿quieres continuar?")){
        Meteor.call('deleteCompany', FlowRouter.getParam("id"));
        Session.set("companyID",null);
        FlowRouter.go("/viewIndustries/"+Meteor.userId());
      }
    }


    
});

