import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Message } from '../api/message.js';

import './messageIcon.html'; 
import '/lib/common.js';

function getConversationIDsFromInteractions(){
  var interactions = new Array();
  var ids = new Array();
  if(Meteor.user()!=null && Meteor.user().messagesList!=null){
    interactions = Meteor.user().messagesList;
    for (var i = 0; i < interactions.length; i++) {
      ids.push(interactions[i].conversationId);
    }
  }
  return ids;
}

function getMessagesWithId(conversationId){
  Meteor.subscribe("messages");
  return Message.find({$and:[
    {'conversationId':conversationId},
    {'read':false}
    ]});
}

Template.messageIcon.helpers({
   countMessages(){
    var count=0;

    var ids = getConversationIDsFromInteractions();
    
    for (var i = 0; i < ids.length; i++) {
      messages = getMessagesWithId(ids[i]);
      _.forEach(messages.fetch(),function(item){
        console.log(item.sender);
        if(Meteor.userId()!=item.sender){
          count++;  
        }
        
      });
    }


    
    if(count==0){
      count=null;
    }
    return count;
   },
   
 });

Template.messageIcon.events({
 'click #goToMessages' : function(e, template, doc){
   e.preventDefault();
   console.log("Va para los mensajes");
   Session.set("partnerId",null);
   Session.set("conversationId",null);
   FlowRouter.go("/messages");
   
 }
});