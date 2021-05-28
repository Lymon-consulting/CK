import { Template } from 'meteor/templating';
import { Message } from '../api/message.js';
import { Media } from '../api/media.js';
import { trimInput } from '/lib/functions.js';
import { isNotEmpty } from '/lib/functions.js';

import './messages.html';

function isFirstTime(from,to){
  var user1 = Meteor.users.find({'_id':from, 'messagesList.partnerId':to});
  var user2 = Meteor.users.find({'_id':to, 'messagesList.partnerId':from});

  if((user1!=null && user1.count()>0) || (user2!=null && user2.count()>0)){
    //console.log("ya existe relación");
    return false;
  }
  else{
    //console.log("No existe relación");
    return true;
  }

}

function sendMessage(){
  var from = Meteor.userId();
  var to;
  /*if(Session.get("firstInteraction")!=null){
    to = Session.get("firstInteraction");
  }
  else */
  if(Session.get("partnerId")!=null){
    to = Session.get("partnerId");
  } 
  var message = trimInput($('#message').val());
  var conversationId;
/*
  if(isFirstTime(from, to)){
    conversationId = Meteor.call(
                          'createRelationship',
                          from,
                          to,
                          function(error, result){
                            //console.log("Del sever viene el conversationId="+result);
                            Session.set("conversationId",result);
                            if(isNotEmpty(message)){
                              Meteor.call(
                                'sendMessage',
                                parseInt(result),
                                Meteor.userId(),
                                message
                              );
                              Meteor.call(
                                'updateRelationship',
                                parseInt(result),
                                Meteor.userId(),
                                to,
                              );
                              $('#message').val("");
                            }
                          }
                        ); 
    Session.set("partnerId",to);
  }
  else{
    */
    if(Session.get("conversationId")!=null){
      conversationId = Session.get("conversationId");
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
          to,
        );
        $('#message').val("");
      }
    }
  //}

  
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

  Meteor.call("getServerDate", function (error, result) {
        //Session.set("time", result);
        Session.set("serverDate",result);
        //serverDate = result;
    });

  
  
});

Template.messages.onDestroyed(function(){
  //console.log("Saliendo de mensajes, borrando variables de sesión");
  Session.set("firstInteraction",null);
  Session.set("partnerId",null);
  Session.set("conversationId",null);
  Session.set("comesFromCrew",null);
  Session.set("comesFromCast",null);
});


Template.messages.helpers({
  getPartners(){
    //interaction = Session.get("interaction");
    var conversations = [];
    var result = new Array();
    if(Meteor.user()!=null && Meteor.user().messagesList!=null){
      conversations = Meteor.user().messagesList;
      //console.log(conversations);
    }
    else if(Session.get("partnerId")!=null){
      //if(Session.get("firstInteraction")!=null){
        //console.log("La variable firstInteraction trae valor");
        var interaction = {};
        interaction.conversationId = -1;
        interaction.partnerId = Session.get("partnerId");
        interaction.modifiedAt = new Date();
        conversations.push(interaction);
      //}
      //else{
        //console.log("La variable firstInteraction es nula");
      //}
      //return _.sortBy(conversations,'modifiedAt').reverse();

      
    }
    //return _.uniq(conversations, false, function(transaction) {
      //return _.sortBy(conversations.conversationId,'modifiedAt').reverse;
    //});

    return _.sortBy(conversations,'modifiedAt').reverse();
  },
  getName(partner){
    console.log("en getName partner vale "+partner);
    var user = Meteor.users.findOne({'_id':partner});
    var name = "";
    if(user!=null){
      name = user.fullname;
    }
    console.log(name);
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
  getInitials(userId){
      var name = "";
      var lastname = "";
      var initials = "";      
      var user = Meteor.users.findOne({'_id':Meteor.userId()});
      if(user){
        name = user.profile.name;
        lastname = user.profile.lastname;
        initials = name.charAt(0) + lastname.charAt(0);  
      }
      return initials;
    },
  getProfilePicture(userId) {
    Meteor.subscribe("allMedia");
    var user = Meteor.users.findOne({'_id':userId});
    var profile;
    if(user!=null){
      
      //if(user.crew!=null && user.crew.profilePictureID!=null){
        profile = Media.findOne({'mediaId':user.profilePictureID});
        if(profile!=null){
          return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_30,h_30,c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
        }
        //else if(user.cast!=null && user.cast.profilePictureID!=null){
          //profile = Media.findOne({'mediaId':user.cast.profilePictureID});
          //if(profile!=null){
            //return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_30,h_30,c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.cast.profilePictureID;    
          //}  
        //}  
      //}
    }
  },
  formatDate(date){
    var dateStr="";
    var serverDate;

    
    if(Session.get("serverDate")!=null){
      serverDate = Session.get("serverDate");
      //console.log(serverDate);

      //var serverDate = Session.get("serverDate");
      if(date.getDate()===serverDate.getDate() && 
          date.getMonth()===serverDate.getMonth() && 
          date.getFullYear()===serverDate.getFullYear()){
        dateStr =
          ("00" + date.getHours()).slice(-2) + ":" +
          ("00" + date.getMinutes()).slice(-2);
      }
      else{
        dateStr =
          ("00" + date.getDate()).slice(-2) + "/" +
          ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
          date.getFullYear() + " " +
          ("00" + date.getHours()).slice(-2) + ":" +
          ("00" + date.getMinutes()).slice(-2);
      }
    }
    

    return dateStr;

    /*var d = new Date(date);
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
    }*/

    
    
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
    /*if(Session.get("firstInteraction")!=null){
      var user = Meteor.users.findOne({'_id':Session.get("firstInteraction")});
      if(user!=null){
        name = user.fullname;
      }
    }
    else */
    if(Session.get("partnerId")!=null){
      var partnerId = Meteor.users.findOne({'_id':Session.get("partnerId")});
      if(partnerId!=null){
        name = partnerId.fullname;
      }
    }
    return name;
  },
  getSelectedPicture(){
    var receiver;
    var profile;
    var partnerId;
    //if(Session.get("firstInteraction")!=null){
      //userId = Session.get("firstInteraction");
      //user = Meteor.users.findOne({'_id':userId});
      //if(user!=null){
        //if(Session.get("comesFromCrew")!=null && Session.get("comesFromCrew")===true && user.crew!=null && user.crew.profilePictureID!=null){//La interacción viene desde un perfil de crew
          //profile = Media.findOne({'mediaId':user.profilePictureID});
          //if(profile!=null){
            //return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_30,h_30,c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
          //}
        //}
        //else if(Session.get("comesFromCast")!=null && Session.get("comesFromCast")===true && user.cast!=null && user.cast.profilePictureID!=null){//La interacción viene desde un perfil de cast
          //profile = Media.findOne({'mediaId':user.cast.profilePictureID});
          //if(profile!=null){
            //return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_30,h_30,c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
          //}
        //}  
      //}
    //}
    //else 
    if(Session.get("partnerId")!=null){
      partnerId = Session.get("partnerId");
      receiver = Meteor.users.findOne({'_id':partnerId});
      if(receiver!=null){
        //if(user.crew!=null && user.crew.profilePictureID!=null){
          profile = Media.findOne({'mediaId':receiver.profilePictureID});
          if(profile!=null){
            return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_30,h_30,c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + receiver.profilePictureID;    
          }
          //else if(user.cast!=null && user.cast.profilePictureID!=null){
            //profile = Media.findOne({'mediaId':user.cast.profilePictureID});
            //if(profile!=null){
              //return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_30,h_30,c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
            //}  
          //}  
        //}
      }
    }
  },
  wasSelected(item){
    var partnerId;
    var wasSelected=false;
    /*if(Session.get("firstInteraction")!=null){
      interaction = Session.get("firstInteraction");
    }
    else */
    if(Session.get("partnerId")!=null){
      partnerId = Session.get("partnerId");
      if(item===partnerId){
        console.log("wasSelected=true");
        wasSelected = true;
      }
    }

    
    return wasSelected;
  }
});

Template.messages.events({
  'click .partner': function(event,template){
    var partnerId = $(event.target).attr("data-id");
    //Session.set("firstInteraction",null);
    var conversationId = $(event.target).attr("data-conversation");
    if(partnerId!=null && partnerId!="undefined"){
      Session.set("partnerId", partnerId);  
    }
    if(conversationId!=null && conversationId!="undefined"){
      Session.set("conversationId", conversationId); 
    }
  },
  'click #send': function(event,template){
    event.preventDefault();
    //console.log("Llamando sendMessage desde #send");
    sendMessage();
    //Session.set("firstInteraction",null);
  },
  'keyup #message': function(event,template){
    event.preventDefault();
    if(event.which === 13){
      //console.log("Llamando sendMessage desde #message");
      sendMessage();  
      //Session.set("firstInteraction",null);
    }
    
  },
});