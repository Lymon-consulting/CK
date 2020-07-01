import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { uploadFiles } from '/lib/functions.js';
import { trimInput } from '/lib/functions.js';
import { isNotEmpty } from '/lib/functions.js';

import './industryPage.html';
Meteor.subscribe("otherUsers");


Template.industryPage.rendered = function(){
  this.autorun(function(){
    window.scrollTo(0,0);
  });
}

Template.industryPage.helpers({
 getCompany(){
  return Industry.findOne({_id : FlowRouter.getParam('id')});
},
isOwner(){
  industry = Industry.findOne({'_id': FlowRouter.getParam('id')});
  if(industry!=null && industry.userId === Meteor.userId()) {
   val = true;
 }
 else{
   val = false;
 }
 return val;
},
getProjects(){
  Meteor.subscribe("myProjects", FlowRouter.getParam('id'));
      //return Project.find({$and : [ {'userId' : FlowRouter.getParam('id')} , {"project_is_main": '' }]});
      return Project.find({'userId' : FlowRouter.getParam('id')});
    },

    getMainProject(){
      Meteor.subscribe("myMainProject", FlowRouter.getParam('id'));
      return Project.findOne({'userId': FlowRouter.getParam('id'), 'project_is_main' : 'true'});
    },
    getProjectImages(projId, size){
      Meteor.subscribe("allMedia");
      var data = Project.findOne({'_id' : projId});
      var url;
      if(data!=null && data.projectPictureID!=null){
        var cover = Media.findOne({'mediaId':data.projectPictureID});
        if(cover!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_scale" + "/v" + cover.media_version + "/" + data.userId + "/" + data.projectPictureID;    
        }
        
      }
      return url;
    },
    notSameUser(){
      val = true;
      if(FlowRouter.getParam('id')=== Meteor.userId()){
       val = false;
     }
     return val;
   },
   getCoverPicture() {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    var url;
    if(data!=null && data.companyCoverID!=null){
      var cover = Media.findOne({'mediaId':data.companyCoverID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + cover.media_version + "/" + data.userId + "/" + data.companyCoverID;    
      }
      
    }
    return url;
    /*
     var url = "";
     var company = Industry.findOne({'_id':FlowRouter.getParam('id')});
     if(company!=null && company.companyCoverID!=null && company.companyCoverID!=""){
      url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_1200,h_250,c_fill/" + company.companyCoverID;
    }
    return url;*/
  },
  getLogoPicture(size) {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
    var url;
    if(data!=null && data.companyLogoID!=null){
      var cover = Media.findOne({'mediaId':data.companyLogoID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + cover.media_version + "/" + data.userId + "/" + data.companyLogoID;    
      }
      
    }
    return url;
    /*
   var url = "";
   var company = Industry.findOne({'_id':FlowRouter.getParam('id')});
   if(company!=null && company.companyLogoID!=null && company.companyLogoID!=""){
    url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_fill/" + company.companyLogoID;
  }
  return url;*/
},
getGallery(){
    var data = Industry.findOne({'_id' : FlowRouter.getParam('id')});
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
    getMedia() {
      Meteor.subscribe("allMedia");
      //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
      var media = Media.find({'userId': Meteor.userId()},{sort:{'media_date':-1}});
      return media;
    },
  getURL(mediaId){
    var url = "";
    var media = Media.findOne({'mediaId':mediaId});
      if(media!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + media.userId + "/" + media.mediaId;    
      }
    return url;
  },
  getVideo(vimeo, youtube){
      var url = "";

      if(vimeo && vimeo.length>0){
        url = vimeo;
        if(url.indexOf("//vimeo.com")>1){/*Parseo de la URL para extraer el ID del video en vimeo*/
          var vimeoVideoID = url.substring(url.indexOf(".com/")+5, url.length);
          url = "https://player.vimeo.com/video/" + vimeoVideoID+"?portrait=0";
        }
      }
      else if(youtube && youtube.length>0){
        url = youtube;        
        if(url.indexOf("youtube.com/watch?v=")>1){/*Parseo de la URL para extraer el ID del video en youtube*/
          var youtubeVideoID = url.substring(url.indexOf("?v=")+3, url.length);
          url = "https://www.youtube.com/embed/" + youtubeVideoID;
        }
      }
      return url;
    },
});

Template.company_crew.helpers({
  getCrew(){
   var collabs = null;
   var company = Industry.findOne({"_id": FlowRouter.getParam('id')});
   if(company){
    collabs = company.company_staff;
    var owner = Meteor.users.findOne({'_id':company.userId});
    if(owner!=null){
      var boss = {
        '_id': company.userId,
        'name': owner.fullname,
        'confirmed': true 
      };
      if(collabs!=null){
        collabs.unshift(boss);  
      }
      
    }
    
  }
  return collabs;
},
profilePicture(userId){
 return Images.find({'owner': userId});
},
getProfilePicture(userId) {
  Meteor.subscribe("allMedia");
  var user = Meteor.users.findOne({'_id':userId});
  var url;
  if(user!=null && user.profilePictureID!=null){
    var profile = Media.findOne({'mediaId':user.profilePictureID});
    if(profile!=null){
      url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_100,h_100,c_thumb,r_max" + "/v" + profile.media_version + "/" + userId + "/" + user.profilePictureID;    
    }
    
  }
  return url;
},
getCollaboratorTitle(){
  var result = Meteor.settings.public.DEFAULT_COLLABORATOR_TITLE_FOR_COMPANY_PAGE;
  var company = Industry.findOne({"_id": FlowRouter.getParam('id')});
  if(company){
    if(company.collaborator_section_title!=null && company.collaborator_section_title!=""){
      result = company.collaborator_section_title;
    }
  }
  return result;
},

getInitials(userId){
  var name = "";
  var lastname = "";
  var initials = "";      
  var user = Meteor.users.findOne({'_id':userId});
  if(user){
    name = user.profile.name;
    lastname = user.profile.lastname;
    initials = name.charAt(0) + lastname.charAt(0);  
  }
  return initials;
},
isOwner(){
  industry = Industry.findOne({'_id': FlowRouter.getParam('id')});
  if(industry!=null && industry.userId === Meteor.userId()) {
   val = true;
 }
 else{
   val = false;
 }
 return val;
},
});

Template.company_projects.helpers({

  getCompanyProjects(){
    Meteor.subscribe("allProjects");
    var companyProjects = Project.find({ 'companies._id': { $all : [FlowRouter.getParam('id')]}});
    if(companyProjects!=null && companyProjects.count()>0){
      return companyProjects;  
    }
    else{
      return null;
    }
    
  },
  getProjectPicture(projectId, size) {
    Meteor.subscribe("allMedia");
    var data = Project.findOne({'_id' : projectId});
    var url;
    if(data!=null && data.projectPictureID!=null){
      var cover = Media.findOne({'mediaId':data.projectPictureID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_limit" + "/v" + cover.media_version + "/" + data.userId + "/" + data.projectPictureID;    
      }
      
    }
    return url;
    
  },
  getProjectTitle(){
  var result = Meteor.settings.public.DEFAULT_PROJECT_TITLE_FOR_COMPANY_PAGE;
  var company = Industry.findOne({"_id": FlowRouter.getParam('id')});
  if(company){
    if(company.project_section_title!=null && company.project_section_title!=""){
      result = company.project_section_title;
    }
  }
  return result;
},
isOwner(){
  industry = Industry.findOne({'_id': FlowRouter.getParam('id')});
  if(industry!=null && industry.userId === Meteor.userId()) {
   val = true;
 }
 else{
   val = false;
 }
 return val;
},

});

Template.industryPage.events({
  'click #cancel': function(event,template,doc){
    $('#collabModal').modal('toggle');
  },
  'click #search': function(event,template,doc){
    /*$('#collabModal').modal('toggle');
    FlowRouter.go('/searchCollaborator/' + FlowRouter.getParam('id')); */
    $('#collabModal')
    .on('hidden.bs.modal', function() {
      FlowRouter.go('/searchCollaboratorForIndustry/' + FlowRouter.getParam('id')+"/crew");
    })
    .modal('hide');
  },
  'click #searchAdmin': function(event,template,doc){
    /*$('#collabModal').modal('toggle');
    FlowRouter.go('/searchCollaborator/' + FlowRouter.getParam('id')); */
    $('#collabModal')
    .on('hidden.bs.modal', function() {
      FlowRouter.go('/searchCollaboratorForIndustry/' + FlowRouter.getParam('id')+"/industry");
    })
    .modal('hide');
  },
  'click .editIndustry':function(event, template){
    //var companyID = $(event.target).attr('data-answer');
    var companyID = FlowRouter.getParam("id");
    //Session.set("companyID",companyID);
    FlowRouter.go("/editIndustry/" + companyID);
  },
  'click #logoinIndustryPage': function(event,template){
     event.preventDefault();
     $(".media-thumb").css('border','none');
     $("#setProfilePicture").addClass('disabled');
     $('#modal1').modal('show');
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
    'change [type="file"]': function(e, t) {
        //console.log(e.target.name);
        uploadFiles(e.target.files, this._id, e.target.name);
        /*
        $('#modal1').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();*/
      },
      'click #openMediaGallery': function(event,template){
         event.preventDefault();
         $(".media-thumb").css('border','none');
         $("#setCoverPicture").addClass('disabled');
         $('#modal2').modal('show'); 
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
});

Template.company_projects.events({
  'click #changeProjectsTitle': function(event,template){
    event.preventDefault();
     $('#modal-changeProjectsTitle').modal('show'); 
  },
  'change #projectSectionTitle':function(event,template){
    event.preventDefault();
    var project_title = trimInput(event.target.value);   
    Meteor.call('updateCompanyProjectTitle', FlowRouter.getParam("id"), project_title);
  }

});

Template.company_crew.events({
  'click #changeCollaboratorsTitle': function(event,template){
    event.preventDefault();
     $('#modal-changeCollaboratorsTitle').modal('show'); 
  },
  'change #collaboratorstSectionTitle':function(event,template){
    event.preventDefault();
    var project_title = trimInput(event.target.value);   
    Meteor.call('updateCompanyCollaboratorTitle', FlowRouter.getParam("id"), project_title);
  }

});