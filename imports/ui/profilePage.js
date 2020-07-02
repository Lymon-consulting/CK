import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { Industry } from '../api/industry.js';
import { uploadFiles } from '/lib/functions.js';

import './profilePage.html';
Meteor.subscribe("otherUsers");

Template.profilePage.rendered = function(){
  this.autorun(function(){
    window.scrollTo(0,0);
  });
}

function isFirstTime(from,to){
  var user1 = Meteor.users.find({'_id':from, 'messagesList.partnerId':to});
  var user2 = Meteor.users.find({'_id':to, 'messagesList.partnerId':from});

  if((user1!=null && user1.count()>0) || (user2!=null && user2.count()>0)){
    console.log("ya existe relación");
    return false;
  }
  else{
    console.log("No existe relación");
    return true;
  }

}

Template.profilePage.helpers({
   getProfile(){
      
      //console.log(FlowRouter.getParam('id'));
      return Meteor.users.findOne({_id : FlowRouter.getParam('id')});
   },
   getName(userId){
      var name = "";
      var user = Meteor.users.findOne({'_id':userId});
      if(user){
        if(user.profile.name!=null && user.profile.name!=""){
          name = user.profile.name;  
        }
        if(user.profile.lastname!=null && user.profile.lastname!=""){
          name = name + " " + user.profile.lastname;
        }
        if(user.profile.lastname2!=null && user.profile.lastname2!=""){
          name = name + " " + user.profile.lastname2;
        }
      }
      return name;
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
    isOwner(){
      var result = false;
      if(Meteor.userId()=== FlowRouter.getParam("id")){
        result = true;
      }
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
   getProfileRoles(){
    var u = Meteor.users.findOne({'_id': FlowRouter.getParam('id')});
    var result = new Array();
    var strResult = "";
    if(u){
      userTopRoles = u.topRole;
      if(userTopRoles){
        for (var i = 0; i < userTopRoles.length; i++) {
          if(userTopRoles[i]==="1"){
            result.push("Producción");
          }
          else if(userTopRoles[i]==="2"){
            result.push("Dirección");
          }
        }
      }
      userRoles = u.role;
      if(userRoles){
        for (var i = 0; i < userRoles.length; i++) {
          result.push(userRoles[i]);
        }
      }

      for (var i = 0; i < result.length; i++) {
        strResult = strResult + ", " + result[i];
      }
      strResult = strResult.substring(2, strResult.length);




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
      Meteor.subscribe("myProjects");
      //Meteor.users.find  ({$and : [ {'_id' : Meteor.userId()} ,            {"follows": follow      }]});
      return Project.find({
        $and : [ 
          {'userId' : FlowRouter.getParam('id')},
          {'project_is_main':false}
        ]
      });
   },
   countProjects(){
     Meteor.subscribe("myProjects");
     var count = Project.find({'userId' : FlowRouter.getParam('id')}).count();
     if(count>0){
       return true;
     }
     else{
       return false;
     }
   },
   countCollaborations(){
     Meteor.subscribe("myProjects");
     //var countCast = Project.find({"project_cast._id":  FlowRouter.getParam('id')}).count();
     var countCrew = Project.find({"project_staff._id":  FlowRouter.getParam('id')}).count();

     var result = false;

     if(countCrew>0){
       result = true;
     }
     else{
       result = false;
     }
     return result;
   },/*
   getCastCollaborations(){
      Meteor.subscribe("myProjects");
      return Project.find({"project_cast._id":  FlowRouter.getParam('id')});
   },*/
   getCrewCollaborations(){
      Meteor.subscribe("myProjects");
      return Project.find({"project_staff._id":  FlowRouter.getParam('id')},{sort: {'project_year':-1} });
      //var media = Media.find({'userId': Meteor.userId()},{sort: {'media_date':-1} });
   },
   getMainProject(){
      Meteor.subscribe("myProjects");
      return Project.findOne({
        $and : [ 
          {'userId' : FlowRouter.getParam('id')},
          {'project_is_main':true}
        ]
      });
   },
   getProjectImages(projId, size){
    Meteor.subscribe("allMedia");
      var data = Project.findOne({'_id' : projId});
      var url;
      if(data!=null && data.projectPictureID!=null){
        var cover = Media.findOne({'mediaId':data.projectPictureID});
        if(cover!=null){
          //url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_scale" + "/v" + cover.media_version + "/" + data.userId + "/" + data.projectPictureID;    
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + cover.media_version + "/" + data.userId + "/" + data.projectPictureID;    
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
   projectCollaboration(projId){
      /*var u = Project.findOne({'_id': projId});
      var result = "";
      if(u){
         for (var i = 0; i < u.project_cast.length; i++) {
           if(u.project_cast[i]._id===FlowRouter.getParam("id")){
             result = u.project_cast[i].
           }
         }
      }

      return result;*/
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
   getFollowName(userId){
     var user = Meteor.users.findOne({'_id' : userId}); 
     if(user){
       if(user.isCast && user.showArtisticName){
          return user.artistic;
       }
       else{
         return user.fullname;
       }
     }
   },
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

isDirectorOrProducer(){
   Meteor.subscribe("otherUsers");
   var user = Meteor.users.findOne({'_id' : FlowRouter.getParam('id')});
   var array = new Array();
    var result = false;
    if(user!=null && user.topRole!=null){
      array = user.topRole;
      for (var i = array.length - 1; i >= 0; i--) {
        if(array[i]==="1"){
          result = true;  
          break;
        }
        if(array[i]==="2"){
          result = true;  
          break;
        }
        

      }
    }
    return result;
  },
   getProfilePicture(userId, size) {
      Meteor.subscribe("allMedia");
      var user = Meteor.users.findOne({'_id':userId});
      var url;
      if(user!=null && user.crew!=null && user.crew.profilePictureID!=null){
        var profile = Media.findOne({'mediaId':user.crew.profilePictureID});
        if(profile!=null){
          //url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.profilePictureID;    
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + profile.media_version + "/" + userId + "/" + user.crew.profilePictureID;    
        }
        
      }
      return url;
    
    },
    getLogoPicture(companyId,size){
      Meteor.subscribe("allMedia");
      console.log(companyId);
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
   getProfilePicture(userId, size) {
      Meteor.subscribe("allMedia");
      var user = Meteor.users.findOne({'_id':userId});
      var url;
      if(user!=null && user.crew!=null && user.crew.profilePictureID!=null){
        var profile = Media.findOne({'mediaId':user.crew.profilePictureID});
        if(profile!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.crew.profilePictureID;    
        }
        
      }
      return url;
    
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
      if(user!=null && user.crew!=null && user.crew.profileCoverID!=null){
        var cover = Media.findOne({'mediaId':user.crew.profileCoverID});
        if(cover!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + cover.media_version + "/" + userId + "/" + user.crew.profileCoverID;    
        }
        
      }
      return url;
      
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
   },
   'click #profileImageinProfilePage': function(event,template){
     event.preventDefault();
     if(Meteor.userId()===FlowRouter.getParam("id")){
       $(".media-thumb").css('border','none');
       $("#setProfilePicture").addClass('disabled');
       $('#modal1').modal('show');
     }
   },
   
   'click #openMediaGallery': function(event,template){
     event.preventDefault();
     if(Meteor.userId()===FlowRouter.getParam("id")){
       $(".media-thumb").css('border','none');
       $("#setCoverPicture").addClass('disabled');
       $('#modal2').modal('show'); 
     }
     

   },

   'click #selectProfilePicture': function(event,template){
      event.preventDefault();
      var mediaId = $(event.currentTarget).attr("data-id");

      Session.set("mediaId",mediaId);

     $(".media-thumb").css('border','none');
     $(event.target).css('border', "solid 3px #ED1567");
     $("#setProfilePicture").removeClass('disabled');

    },
    'click #setProfilePicture': function(event,template){
       event.preventDefault();
       var mediaId = Session.get("mediaId");

       Meteor.call(
        'updateCrewProfilePicture',
        Meteor.userId(),
        mediaId
        );

        $('#modal1').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

      },
    'click .goMediaLibraryProfile': function(event,template){
      event.preventDefault();
      $('#modal1').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      //FlowRouter.go("/mediaEditor/" + Meteor.userId()+"/crew/profile");
      FlowRouter.go("/mediaEditorObject/" + Meteor.userId()+ "/profileCrew/" + Meteor.userId() + "/profile");
    },
    'click .goMediaLibraryCover': function(event,template){
      event.preventDefault();
      $('#modal2').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      //FlowRouter.go("/mediaEditor/" + Meteor.userId()+"/crew/cover");
      FlowRouter.go("/mediaEditorObject/" + Meteor.userId() + "/profileCrew/" + Meteor.userId() + "/cover");
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
        'updateCrewCoverPicture',
        Meteor.userId(),
        mediaId
        );

        $('#modal2').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $("#setCoverPicture").removeClass('disabled');

      },
      'change [type="file"]': function(e, t) {
        //console.log(e.target.name);
        uploadFiles(e.target.files, this._id, e.target.name);
        /*
        $('#modal1').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();*/
      },
      'click #sendMessage':function(event,template){
        event.preventDefault();
        var from,to;
        from = Meteor.userId();
        to = FlowRouter.getParam("id");
        
        if(isFirstTime(from,to)){
          Meteor.call(
            'createRelationship',
            from,
            to,
          );
        }
        else{
          var user1 = Meteor.users.findOne({'_id':from, 'messagesList.partnerId':to});
          var user2 = Meteor.users.findOne({'_id':to, 'messagesList.partnerId':from});

          if(user1!=null && user1.messagesList!=null){
            var conversationId;

            for (var i = 0; i < user1.messagesList.length; i++) {
              if(user1.messagesList[i]!=null && user1.messagesList[i].partnerId===to){
                conversationId = user1.messagesList[i].conversationId;
                break;
              }
            }

            console.log(parseFloat(conversationId).toFixed(1));

            Meteor.call(
              'updateRelationship',
              conversationId,
              from,
              to,
            );
          }

          
        }

        FlowRouter.go("/messages");

      }
});

Template.profilePage.onRendered(function () {
   Meteor.subscribe("otherUsers");
   Meteor.users.update(
         {'_id': FlowRouter.getParam('id')},
         { $inc:{ 'views': 1}
   });
   
});

