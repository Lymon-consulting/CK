import { Template } from 'meteor/templating';
import { Alert } from '../api/alert.js';
import { Media } from '../api/media.js';
import { timeSince } from '/lib/functions.js';

import './notificationList.html'; 

Meteor.subscribe("alerts");

Template.notificationList.helpers({
    getAlerts(){
        const alerts = Alert.find({
            "receiver": Meteor.userId()            
          },
          {sort:{
            'date':-1
          }
        }).fetch();
        return alerts;
      },
      countAlerts(){
        Meteor.subscribe("alerts");
         const alerts = Alert.find({"receiver": Meteor.userId()}).fetch();
         let count = 0;
         console.log(`----> ${alerts}`);
         if(alerts){
           count = alerts.length;
         }
         if(count>0){
           return count;
         }
         else{
           return null;
         }
         
      },
      getProfilePicture(userId) {
        Meteor.subscribe("allMedia");
        var url;
        var user = Meteor.users.findOne({'_id':userId});
        if(user!=null && user.profilePictureID!=null){
          var profile = Media.findOne({'mediaId':user.profilePictureID});
          if(profile!=null){
            url= Meteor.settings.public.CLOUDINARY_RES_URL + "/w_40,h_40" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
          }
    
        }
        return url;
    },
    getName(userId){
        let user = Meteor.users.findOne({"_id":userId});
        let name = "";
        if(user){
            name = user.fullname;
        }
        return name;
    },
    formatTime(date){
        return timeSince(date);
    },
});

