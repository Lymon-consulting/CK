import { Template } from 'meteor/templating';
import { Message } from '../api/message.js';
import { Media } from '../api/media.js';
import { trimInput } from '/lib/functions.js';
import { isNotEmpty } from '/lib/functions.js';

import './messages.html';

Template.messages.helpers({
  getPartners(){
    if(Meteor.user()!=null && Meteor.user().messagesList!=null){
      return Meteor.user().messagesList;  
    }
  },
  getName(partner){
    var user = Meteor.users.findOne({'_id':partner});
    if(user!=null && user.fullname !=null){
      return user.fullname;
    }
  },
  getMessages(){
    Meteor.subscribe("messages");
    var conversationId;
    var msgDocs;
    if(Session.get("partnerId")!=null){
      var to = Session.get("partnerId");
      var user1 = Meteor.users.findOne({'_id':Meteor.userId(), 'messagesList.partnerId':to});
      if(user1!=null && user1.messagesList!=null){
        for (var i = 0; i < user1.messagesList.length; i++) {
          if(user1.messagesList[i]!=null && user1.messagesList[i].partnerId===to){
            conversationId = user1.messagesList[i].conversationId;
            break;
          }
        }
      }
      if(conversationId!=null){
        //r media =   Media.find({'userId': Meteor.userId()      },{sort: {'media_date' :-1} });
        msgDocs = Message.find({'conversationId':conversationId});
      }
    }
    return msgDocs;
  },
  getProfilePicture(userId) {
    Meteor.subscribe("allMedia");
    var user = Meteor.users.findOne({'_id':userId});
    if(user!=null && user.crew!=null && user.crew.profilePictureID!=null){
      var profile = Media.findOne({'mediaId':user.crew.profilePictureID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_40,h_40,c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.crew.profilePictureID;    
      }

    }
  },
  formatDate(date){
    var d = new Date(date);
    var month = d.toLocaleString('default', { month: 'long' });
    var datestring = d.getDate()  + " " + month + " " + d.getFullYear() + " " + d.getMinutes();
    return datestring;
  },
  getSelectedPartner(){
    if(Session.get("partnerId")!=null){
      var user = Meteor.users.findOne({'_id':Session.get("partnerId")});
      if(user!=null && user.fullname !=null){
        return user.fullname;
      }
    }
  },
  getSelectedPicture(){
    if(Session.get("partnerId")!=null){
      var user = Meteor.users.findOne({'_id':Session.get("partnerId")});
      if(user!=null && user.crew!=null && user.crew.profilePictureID!=null){
        var profile = Media.findOne({'mediaId':user.crew.profilePictureID});
        if(profile!=null){
          return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_40,h_40,c_thumb,r_max/" + "/v" + profile.media_version + "/" + Session.get("partnerId") + "/" + user.crew.profilePictureID;    
        }

      }
    }
  }
});

Template.messages.events({
  'click .partner': function(event,template){
    var partnerId = $(event.target).attr("data-id");
    var conversationId = $(event.target).attr("data-conversation");
    Session.set("partnerId",partnerId);
    Session.set("conversationId", conversationId);    
  },
  'click #send': function(event,template){
    var message = trimInput($('#message').val());
    if(Session.get("partnerId")!=null && Session.get("conversationId")!=null){
      var partnerId = Session.get("partnerId");
      var conversationId = Session.get("conversationId");
      if(isNotEmpty(message)){

        console.log(Meteor.userId() + " envía a "+ partnerId + " " + message);
        
        Meteor.call(
          'sendMessage',
          parseInt(conversationId),
          Meteor.userId(),
          message,
        );
        $('#message').val("");
      }
    }
    
    
  }
});