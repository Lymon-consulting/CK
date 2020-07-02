import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { Industry } from '../api/industry.js';
import { getPicture } from '/lib/functions.js';
import { timeSince } from '/lib/functions.js';

import './messageIcon.html'; 
import '/lib/common.js';

Template.messageIcon.helpers({
   countMessages(){
    var messages = new Array();
    var count = 2;
    if(Meteor.user()){
      messages = Meteor.user().messagesList;
      if(messages && messages.length>0){
        count=0;
        for (var i = 0; i < messages.length; i++) {
          if(!messages[i].read){
            count++;
          }
        }
      }
      
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
   console.log("Dentro");
   FlowRouter.go("/messages");
   
 }
});