import { Template } from 'meteor/templating';
import { Message } from '../api/message.js';
import { Media } from '../api/media.js';
import { trimInput } from '/lib/functions.js';
import { isNotEmpty } from '/lib/functions.js';

import './messages.html';


function sendMessage(){
  var message = trimInput($('#message').val());
  if(Session.get("partnerId")!=null && Session.get("conversationId")!=null){
    var partnerId = Session.get("partnerId");
    var conversationId = Session.get("conversationId");
    if(isNotEmpty(message)){
      Meteor.call(
        'sendMessage',
        parseInt(conversationId),
        Meteor.userId(),
        message
      );
      Meteor.call(
        'updateRelationship',
        parseInt(conversationId),
        Meteor.userId(),
        partnerId,
      );
      $('#message').val("");
    }
  }
}

Template.body.onCreated(function bodyOnCreated() {
  
  this.messagesSub = this.subscribe("messages"); //get messages
  
});

Template.body.onRendered(function bodyOnRendered() {
  
  const $messagesScroll = this.$('.messages-scroll');


  //this is used to auto-scroll to new messages whenever they come in
  
  let initialized = false;
  
  this.autorun(() => {
    if (this.messagesSub.ready()) {
      //Message.find({}, { fields: { _id: 1 } }).fetch();
      Tracker.afterFlush(() => {
        //only auto-scroll if near the bottom already
        if (!initialized || Math.abs($messagesScroll.scrollHeight - $messagesScroll.scrollTop() - $messagesScroll.outerHeight()) < 200) {
          initialized = true;
          $messagesScroll.stop().animate({
            scrollTop: $messagesScroll.scrollHeight
          });
        }
      });
    }
  });
  
});

Template.messages.helpers({
  getPartners(){
    
    var result = new Array();
    if(Meteor.user()!=null && Meteor.user().messagesList!=null){
      var conversations = Meteor.user().messagesList;
      return _.sortBy(conversations,'modifiedAt').reverse();
    }
  },
  getName(partner){
    var user = Meteor.users.findOne({'_id':partner});
    var name = "";
    if(user!=null){
      if(user.isCast && user.cast.showArtisticName){//es cast
        name = user.cast.artistic;
      }      
      else{
        name = user.fullname;
      }
    }
    
    return name;
  },
  countMessages(conversationId){
    Meteor.subscribe("messages");
    var count=0;
    messages = Message.find({$and:[
      {'conversationId':conversationId},
      {'read':false}
      ]});
    _.forEach(messages.fetch(),function(item){
        if(Meteor.userId()!=item.sender){
          count++;  
        }
      });
    if(count==0){
      count=null;
    }
    return count;
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
        msgDocs = Message.find({'conversationId':conversationId});  

        _.forEach(msgDocs.fetch(),function(item){
          if(item.sender===Session.get("partnerId")){
            Meteor.call(
              'markAsRead',
              item._id,
              true
            );
          }
        });
              
      }
    }
    return msgDocs;
  },
  getProfilePicture(userId) {
    Meteor.subscribe("allMedia");
    var user = Meteor.users.findOne({'_id':userId});
    var profile;
    if(user!=null){
      if(user.viewAs===1 && user.crew!=null && user.crew.profilePictureID!=null){//ver como crew
        profile = Media.findOne({'mediaId':user.crew.profilePictureID});
        if(profile!=null){
          return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_30,h_30,c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.crew.profilePictureID;    
        }
      }
      else if(user.viewAs===2 && user.cast!=null && user.cast.profilePictureID!=null){//ver como cast
        profile = Media.findOne({'mediaId':user.cast.profilePictureID});
        if(profile!=null){
          return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_30,h_30,c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.cast.profilePictureID;    
        }
      }
    }
  },
  formatDate(date){
    var d = new Date(date);
    var dateStr;

    if(date.getDate()===d.getDate() && date.getMonth()===d.getMonth() && date.getFullYear()===d.getFullYear()){
      dateStr =
        ("00" + d.getHours()).slice(-2) + ":" +
        ("00" + d.getMinutes()).slice(-2) + ":" +
        ("00" + d.getSeconds()).slice(-2);
    }
    else{
      dateStr =
        ("00" + (d.getMonth() + 1)).slice(-2) + "/" +
        ("00" + d.getDate()).slice(-2) + "/" +
        d.getFullYear() + " " +
        ("00" + d.getHours()).slice(-2) + ":" +
        ("00" + d.getMinutes()).slice(-2) + ":" +
        ("00" + d.getSeconds()).slice(-2);
    }

    
    return dateStr;
  },
  senderIsTheSameUser(partnerId){
    if(partnerId===Meteor.userId()){
      return true;
    }
    else{
      return false;
    }
  },
  getSelectedPartner(){
    var name = "";
    if(Session.get("partnerId")!=null){
      var user = Meteor.users.findOne({'_id':Session.get("partnerId")});
      if(user!=null){
        if(user.isCast && user.cast.showArtisticName){//es cast
          name = user.cast.artistic;
        }      
        else{
          name = user.fullname;
        }
      }
    }
    return name;
  },
  getSelectedPicture(){
    if(Session.get("partnerId")!=null){
      var user = Meteor.users.findOne({'_id':Session.get("partnerId")});
      if(user!=null && user.crew!=null && user.crew.profilePictureID!=null){
        var profile = Media.findOne({'mediaId':user.crew.profilePictureID});
        if(profile!=null){
          return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_30,h_30,c_thumb,r_max/" + "/v" + profile.media_version + "/" + Session.get("partnerId") + "/" + user.crew.profilePictureID;    
        }

      }
    }
  },
  wasSelected(partnerId){
    if(partnerId===Session.get("partnerId")){
      return true;
    }
    else{
      return false;
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
    event.preventDefault();
    sendMessage();
  },
  'keyup #message': function(event,template){
    event.preventDefault();
    if(event.which === 13){
      sendMessage();  
    }
    
  },
});