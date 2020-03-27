import { Template } from 'meteor/templating';

import './confirmProfile.html';

Template.confirmProfile.helpers({
  typeIsCrew(){
    if(FlowRouter.getParam("type")==="crew"){
      return true;
    }
    else{
      return false;
    }
  }
});

Template.confirmProfile.events({
  'click .saveProfile': function(event, template){
    event.preventDefault();

    var value = $(event.target).attr('data-type');

    if(value==="1"){
      Meteor.call('addRole', Meteor.userId(),"Productor");
    }
    else if(value==="2"){
      Meteor.call('addRole', Meteor.userId(),"Director");
    }
    else if(value==="3"){
      Meteor.call('addRole', Meteor.userId(),"Director");
      Meteor.call('addRole', Meteor.userId(),"Productor");
    }

    FlowRouter.go('/editProfile/' + Meteor.userId());

  }
});