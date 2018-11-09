import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';


import './profilePage.html';

Template.profilePage.helpers({
   getProfile(){
      Meteor.subscribe("otherUsers");
      //console.log(FlowRouter.getParam('id'));
      return Meteor.users.findOne({_id : FlowRouter.getParam('id')});
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
   personalCover(userId){
      Meteor.subscribe("personalcover");
      return PersonalCover.find({'owner': userId});
   },
   getProjects(userId){
      Meteor.subscribe("myProjects");
      return Project.find({'userId': FlowRouter.getParam('id'), 'project_is_main' : ''});
   },
   getMainProject(){
      Meteor.subscribe("myMainProject", FlowRouter.getParam('id'));
      return Project.findOne({'userId': FlowRouter.getParam('id'), 'project_is_main' : 'true'});
   },
   getProjectImages(projId){
      Meteor.subscribe("cover");
      return Cover.find({'project_id': projId});
   },
   notSameUser(){
      val = true;
      if(FlowRouter.getParam('id')=== Meteor.userId()){
         val = false;
      }
      return val;
   },
   showButtonFollow(follow){
      var following = Meteor.users.find({$and : [ {'_id' : Meteor.userId()} , {"profile.follows": FlowRouter.getParam('id') }]});

      var found = true;
      if(following.count() > 0){
         found = false;
      }
      return found;
   },
   getFollowers(userId){
      Meteor.subscribe("otherUsers");
      return Meteor.users.find({'profile.follows': FlowRouter.getParam('id')});
   }
});


Template.profilePage.events({
   'click #pushFollow': function(event, template) {
      event.preventDefault();
      Meteor.users.update(
         {'_id': Meteor.userId()},
         { $push: { 'profile.follows': FlowRouter.getParam('id') } }
      );

      $("#pushFollow").attr("disabled", true);
   }
});


