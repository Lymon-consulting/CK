import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { Industry } from '../api/industry.js';


import './profilePageActor.html';
Meteor.subscribe("otherUsers");
Template.profilePageActor.helpers({
   getProfile(){
    return Meteor.users.findOne({'_id' : FlowRouter.getParam('id')});
   },
   getName(userId){
      Meteor.subscribe("otherUsers");
      var name = "";
      var user = Meteor.users.findOne({'_id':userId});
      
      if(user!=null && user.cast!=null){
        if(user.cast.showArtisticName!=null && user.cast.showArtisticName===true){
          name = user.cast.artistic;
        }
      }
      else{
        if(user!=null && user.profile.name!=null && user.profile.name!=""){
          name = user.profile.name;  
        }
        if(user!=null && user.profile.lastname!=null && user.profile.lastname!=""){
          name = name + " " + user.profile.lastname;
        }
        if(user!=null && user.profile.lastname2!=null && user.profile.lastname2!=""){
          name = name + " " + user.profile.lastname2;
        }
      }
      return name;
    },
    getGender(type){
      var result = "";
      if(type==="m"){
        result = "Masculino";
      }
      else if(type==="f"){
        result = "Femenino"
      }
      else{
        result = "Sin definir";
      }
      return result;

    },
    isMale(type){
      var result = true;
      if(type!='m'){
        result = false;
      }
      return result;
    },
    getPersonalURL(userId){
      var result = "";
      var user = Meteor.users.findOne({'_id':userId});
      if(user){
        if(user.isCrew!=null && user.isCrew){
          result = "/profilePage";

        }
        else if(user.isCast!=null && user.isCast){
          result = "/profilePageActor";
        }
      }
      return result;

    },
    getBeard(val){
      var result="";
      if(val==="true"){
        result = "Si";
      }
      else if(val==="false"){
        result = "No";
      }
      else{
        result="Sin definir";
      }
      return result;
    },
    getLanguageList(list){
      var result = "";
      for (var i = 0; i < list.length; i++) {
        result = result + ", " + list[i];
      }
      result = result.substring(2,result.length);
      return result;
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
   categories(){
      var strResult = "";
    
      var user = Meteor.users.findOne({'_id': FlowRouter.getParam('id')});
      var result = new Array();
      
      if(user!=null && user.cast!=null && user.cast.categories!=null){
         result = user.cast.categories;
         for (var i = 0; i < result.length; i++) {
           strResult = strResult + ", " + result[i];
         }
         strResult = strResult.substring(2,strResult.length);
      }
      return strResult;      
   },
   getEmail(){
      var email = "";
      Meteor.subscribe("otherUsers");
      var user = Meteor.users.findOne({_id : FlowRouter.getParam('id')});
      if(user){
         email = user.emails[0].address;   
      }
      return email;
   },
   profilePicture(userId){
      Meteor.subscribe("images");
      return Images.find({'owner': userId});
   },
/*   personalCover(userId){
      Meteor.subscribe("personalcover");
      return PersonalCover.find({'owner': userId});
   },*/
   getProjects(){
      Meteor.subscribe("myProjects", FlowRouter.getParam('id'));
      //return Project.find({$and : [ {'userId' : FlowRouter.getParam('id')} , {"project_is_main": '' }]});
      return Project.find({'userId' : FlowRouter.getParam('id')});
   },
   getMainProject(){
      Meteor.subscribe("myMainProject", FlowRouter.getParam('id'));
      return Project.findOne({'userId': FlowRouter.getParam('id'), 'project_is_main' : 'true'});
   },
   countProjects(){
     Meteor.subscribe("myProjects", FlowRouter.getParam('id'));
     var count = Project.find({'userId' : FlowRouter.getParam('id')}).count();
     if(count>0){
       return true;
     }
     else{
       return false;
     }
   },
   countCollaborations(){
     Meteor.subscribe("myProjects", FlowRouter.getParam('id'));
     var countCast = Project.find({"project_cast._id":  FlowRouter.getParam('id')}).count();
     var countCrew = Project.find({"project_staff._id":  FlowRouter.getParam('id')}).count();

     var result = false;

     if(countCast>0){
       result = true;
     }
     else if(countCrew>0){
       result = true;
     }
     else{
       result = false;
     }
     return result;
   },
   getCastCollaborations(){
      Meteor.subscribe("myProjects", FlowRouter.getParam('id'));
      return Project.find({"project_cast._id":  FlowRouter.getParam('id')});
   },
   getCrewCollaborations(){
      Meteor.subscribe("myProjects", FlowRouter.getParam('id'));
      return Project.find({"project_staff._id":  FlowRouter.getParam('id')});
   },
   /*
   isDirectorOrProducer(){
   Meteor.subscribe("otherUsers");
   var user = Meteor.users.findOne({'_id' : FlowRouter.getParam('id')});
   var array = new Array();
    var result = false;
    if(user!=null && user.topRole!=null){
      array = user.topRole;
      for (var i = array.length - 1; i >= 0; i--) {
        if(array[i]==="Director"){
          result = true;  
          break;
        }
        if(array[i]==="Productor"){
          result = true;  
          break;
        }
        if(array[i]==="Dueño"){
          result = true;  
          break;
        }
        if(array[i]==="Legal"){
          result = true;  
          break;
        }

      }
    }
    return result;
  },*/
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
    /*
      var url = "";
      var data = Project.findOne({'_id' : projId});
      if(data!=null && data.projectPictureID!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_scale/" + data.projectPictureID;
      }
     return url;*/
   },
   projectRole(projId){
      var u = Project.findOne({'_id': projId});
      var result = "";
      if(u){
         rolesArray = u.project_role;
         if(rolesArray){
            var size = rolesArray.length;
            var count = 0;
            rolesArray.forEach(function(elem){
               result = result + elem;
               count++;
               if(count < size){
                  result = result + ", ";
               }
            });
         }
      }

      return result;
   },
   notSameUser(){
      val = true;
      if(FlowRouter.getParam('id')=== Meteor.userId()){
         val = false;
      }
      return val;
   },
   showButtonFollow(follow){
      var following = Meteor.users.find({$and : [ {'_id' : Meteor.userId()} , {"follows": follow }]});

      var found = true;
      if(following.count() > 0){
         found = false;
      }
      return found;
   },
   getFollowersCount(){
      Meteor.subscribe("otherUsers");
      var count = 0;
      count = Meteor.users.find({ 'follows': { $all : [FlowRouter.getParam('id')]}}).count();
      return count;
   },
   getFollowers(){
      Meteor.subscribe("otherUsers");
      var followers = Meteor.users.find({ 'follows': { $all : [FlowRouter.getParam('id')]}});
      return followers;
   },
   getFollowingCount(){
      Meteor.subscribe("otherUsers");
      var user = Meteor.users.findOne({'_id' : FlowRouter.getParam('id')});
      var count = 0;

      if(user && Array.isArray(user.follows)){
        count = Meteor.users.find({'_id': { $in: user.follows }}).count();
      }
      return count;
   }, 
   getFollowingCast(){
      //find regresa un cursor que contiene los documentos encontrados
      //fetch regresa un arreglo conteniendo los documentos
      Meteor.subscribe("otherUsers");
      var user = Meteor.users.findOne({'_id' : FlowRouter.getParam('id')});
      var following = new Array();  
      var tempUser;
      
      if(user!=null && user.follows!=null){
        for (var i = 0; i < user.follows.length; i++) {
          tempUser = Meteor.users.findOne({'_id' : user.follows[i]});
          if(tempUser && tempUser.isCast){
            following.push(tempUser);
          }
        }
        return following;
      }
      else{
        return [];
      }
   },
   getFollowingCrew(){
      //find regresa un cursor que contiene los documentos encontrados
      //fetch regresa un arreglo conteniendo los documentos
      Meteor.subscribe("otherUsers");
      var user = Meteor.users.findOne({'_id' : FlowRouter.getParam('id')});
      var following = new Array();  
      var tempUser;
      
      if(user!=null && user.follows!=null){
        for (var i = 0; i < user.follows.length; i++) {
          tempUser = Meteor.users.findOne({'_id' : user.follows[i]});
          if(tempUser && tempUser.isCrew){
            following.push(tempUser);
          }
        }
        return following;
      }
      else{
        return [];
      }
   },
   /*
   getName(userId){
     var user = Meteor.users.findOne({'_id' : userId}); 
     if(user){
       if(user.cast.showArtisticName){
          return user.cast.artistic;
       }
       else{
         return user.fullname;
       }
     }
   },*/
   getFollowingCompanies(){
     Meteor.subscribe("otherUsers");
     var user = Meteor.users.findOne({'_id' : FlowRouter.getParam('id')});

      if(user!=null && user.followCompany!=null){
        return user.followCompany;
      }
      else{
        return [];
      }
   },
   getProfilePicture(userId, size) {
      Meteor.subscribe("allMedia");
      var user = Meteor.users.findOne({'_id':userId});
      var url;
      if(user!=null && user.cast!=null && user.cast.profilePictureID!=null){
        var profile = Media.findOne({'mediaId':user.cast.profilePictureID});
        if(profile!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.cast.profilePictureID;    
        }
        
      }
      return url;
    
    },
    getLogoPicture(companyId,size){
      Meteor.subscribe("allMedia");
      var data = Industry.findOne({'_id' : companyId});
      var url;
      if(data!=null && data.companyLogoID!=null){
        var cover = Media.findOne({'mediaId':data.companyLogoID});
        if(cover!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_limit" + "/v" + cover.media_version + "/" + data.userId + "/" + data.companyLogoID;    
        }
        
      }
      return url;
    },
    getCompanyName(companyId){
      var data = Industry.findOne({'_id' : companyId});
      if(data){
        return data.company_name;  
      }
      else{
        return "";
      }
      
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
    getCoverPicture(userId) {
      Meteor.subscribe("allMedia");
      var user = Meteor.users.findOne({'_id':userId});
      var url;
      if(user!=null && user.cast!=null && user.cast.profileCoverID!=null){
        var cover = Media.findOne({'mediaId':user.cast.profileCoverID});
        if(cover!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_1200,h_600,c_fill/" + "/v" + cover.media_version + "/" + userId + "/" + user.cast.profileCoverID;    
        }
        
      }
      return url;
      
    },
    getGallery(){
    var data = Meteor.users.findOne({'_id' : FlowRouter.getParam("id")});
    var array = new Array();
    
    if(data!=null){
      if(data.cast!=null && data.cast.gallery!=null){
        for (var i = 0; i < data.cast.gallery.length; i++) {
          var obj = {};
          obj.mediaId = data.cast.gallery[i];

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
    if(position===1){
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
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + FlowRouter.getParam('id') + "/" + media.mediaId;    
      }
    return url;
  }
});


Template.profilePage.events({
   'click #pushFollow': function(event, template) {
      event.preventDefault();

      Meteor.call(
         'addFollowTo',
         Meteor.userId(),
         FlowRouter.getParam('id')
      );
      //$("#pushFollow").attr("disabled", true);
   },
   'click #pushUnfollow': function(event, template){
      event.preventDefault();
      Meteor.call(
         'removeFollowTo',
         Meteor.userId(),
         FlowRouter.getParam('id')
      );
   }
});

Template.profilePageActor.onRendered(function () {
   Meteor.subscribe("otherUsers");
   Meteor.users.update(
         {'_id': FlowRouter.getParam('id')},
         { $inc:{ 'views': 1}
   });
   
});

