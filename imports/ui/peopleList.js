import { Template } from 'meteor/templating';

import './peopleList.html';



Template.peopleList.helpers({
   people(){
      /*
      users = Meteor.users.find({}, {sort: {name: 1 }});
      var allUsers = [];
      users.forEach( function(myDoc) {
         details = Meteor.subscribe("otherUsers", myDoc._id);
         allUsers.push(details);
      });
      return allUsers*/

      Meteor.subscribe("otherUsers");
      return Meteor.users.find({}, {sort: {name: 1 }}); 

   },
   profilePicture(userId){
      console.log("Buscando imagenes de "+userId);
      return Images.find({'owner': userId});
   }
});


