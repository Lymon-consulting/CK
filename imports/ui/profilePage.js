import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';


import './profilePage.html';
Meteor.subscribe("otherUsers");
Template.profilePage.helpers({
   getProfile(){
      
      //console.log(FlowRouter.getParam('id'));
      return Meteor.users.findOne({_id : FlowRouter.getParam('id')});
   },
   ownerRole(){
      var u = Meteor.users.findOne({'_id': FlowRouter.getParam('id')});
      var result = "";
      if(u){
         rolesArray = u.role;
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
   getProjectImages(projId, size){
      var url = "";
      var data = Project.findOne({'_id' : projId});
      if(data!=null && data.projectPictureID!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_scale/" + data.projectPictureID;
      }
     return url;
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
   getFollowers(userId){
      Meteor.subscribe("otherUsers");
      return Meteor.users.find({'follows': FlowRouter.getParam('id')});
   },
   getFollowing(){
      //find regresa un cursor que contiene los documentos encontrados
      //fetch regresa un arreglo conteniendo los documentos
      Meteor.subscribe("follows", FlowRouter.getParam('id'));
      var docs = Meteor.users.find({'_id' : FlowRouter.getParam('id')}).map( function(u) { return u.follows; } );

      console.log(docs);
      
      var ids = new Array();
      for(var i=0; i<=docs.length; i++){
         if(docs){
            ids.push(docs[i]);
         }
      }
      
      return ids;
      
   },
   getProfilePicture(userId, size) {
       var url = "";
       var user = Meteor.users.findOne({'_id':userId});
       if(user!=null && user.profilePictureID!=null && user.profilePictureID!=""){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",h_"+size+",c_thumb,r_max/" + user.profilePictureID;
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
       var url = "";
       var user = Meteor.users.findOne({'_id':userId});
       if(user!=null && user.profileCoverID!=null && user.profileCoverID!=""){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_1200,h_250,c_fill/" + Meteor.user().profileCoverID;
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

      

      $("#pushFollow").attr("disabled", true);
   }
});

Template.profilePage.onRendered(function () {
   Meteor.subscribe("otherUsers");
   Meteor.users.update(
         {'_id': FlowRouter.getParam('id')},
         { $inc:{ 'views': 1}
   });
   
});

