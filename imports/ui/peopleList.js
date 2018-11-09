import { Template } from 'meteor/templating';

import './peopleList.html';



Template.peopleList.helpers({
   people(){
      Meteor.subscribe("otherUsers");
      return Meteor.users.find({}, {sort: {name: 1 }}); 
   },
   profilePicture(userId){
      return Images.find({'owner': userId});
   },
   notSameUser(userId){
      val = true;
      if(userId=== Meteor.userId()){
         val = false;
      }
      return val;
   },
   personalCover(userId){
      Meteor.subscribe("personalcover");
      return PersonalCover.find({'owner': userId});
   },
   showButtonFollow(follow){
      var following = Meteor.users.find({$and : [ {'_id' : Meteor.userId()} , {"profile.follows": follow }]});

      var found = true;
      if(following.count() > 0){
         found = false;
      }
      return found;
   },
});


Template.peopleList.events({
   'click #pushFollow': function(event, template) {
      event.preventDefault();
      //console.log("Intentando seguir a "+ Session.get('userID'));
      var user = $("#thisUser").val();
      Meteor.users.update(
         {'_id': Meteor.userId()},
         { $push: { 'profile.follows': user } }
      );

      $("#pushFollow").attr("disabled", true);
   }
});