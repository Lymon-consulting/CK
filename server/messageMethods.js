import { Message } from '../imports/api/message.js';

Meteor.methods({
  createRelationship(sender, receiver) {
    var conversationId = new Date().valueOf();
    var modifiedAt = new Date();

    var doc1 = {
      'partnerId': receiver,
      'conversationId': conversationId,
      'modifiedAt': modifiedAt
    };

    var doc2 = {
      'partnerId': sender,
      'conversationId': conversationId,
      'modifiedAt': modifiedAt
    };

    Meteor.users.update({'_id': sender},
      {
        $addToSet: {
          "messagesList": doc1
        }
    });

    

    Meteor.users.update({'_id': receiver},
      {
        $addToSet: {
          "messagesList": doc2
        }
    });
    return conversationId;
  },
  updateRelationship(conversationId, sender, receiver) {
    var modifiedAt = new Date();
    console.log("Actualizando fecha de conversationId="+conversationId + ", sender="+sender+", receiver="+receiver);
    Meteor.users.update({'_id': sender, 'messagesList.conversationId':conversationId},{
      $set:{
        "messagesList.$.modifiedAt": modifiedAt
      }
    });
    Meteor.users.update({'_id': receiver, 'messagesList.conversationId':conversationId},{
      $set:{
        "messagesList.$.modifiedAt": modifiedAt
      }
    });

  },
  sendMessage(conversationId,sender,message){
    var modifiedAt = new Date();
    return Message.insert({
      "conversationId": conversationId,
      "sender": sender,
      "message": message,
      "messageDate": modifiedAt,
      "read":false
     },function(error,result){
        return result;
     });
  },
  markAsRead(messageId, value){
    Message.update({'_id':messageId},{
      $set:{
        "read":value
      }
    });
  },
  deleteConversation(conversationId, sender, receiver){

    console.log("En deleteConversation");
    console.log(conversationId + " - " + sender + " - " + receiver);

    const userSender = Meteor.users.findOne({'_id': sender});
    let messagesSender = [];
    let conversationSender ={}
    if(userSender){
      messagesSender = userSender.messagesList;
      for (const messageSender of messagesSender) {
        if( messageSender.partnerId===sender){
          conversationSender = {
            'conversationId': messageSender.conversationId,
            'partnerId': messageSender.partnerId,
            'modifiedAt': messagesSender.modifiedAt
          }
          break;
        }
      }

      console.log(conversationSender);

      Meteor.users.update({'_id': sender},{
        $pull:{
          'messagesList': conversationSender
        }
      });
    }
    
    const userReceiver = Meteor.users.findOne({'_id': receiver});
    let messagesReceiver = [];
    let conversationReceiver ={}
    if(userReceiver){
      messagesReceiver = userReceiver.messagesList;
      for (const messageReceiver of messagesReceiver) {
        if( messageReceiver.partnerId===receiver){
          conversationReceiver = {
            'conversationId': messageReceiver.conversationId,
            'partnerId': messageReceiver.partnerId,
            'modifiedAt': messagesReceiver.modifiedAt
          }
          break;
        }
      }

      console.log(conversationReceiver);

      Meteor.users.update({'_id': receiver},{
        $pull:{
          'messagesList': conversationReceiver
        }
      });
    }
    
    
    Message.remove({'conversationId': conversationId});

  }
});

