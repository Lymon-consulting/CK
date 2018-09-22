import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
 
import './header.html';

Template.header.helpers({
  user(){
      return = Meteor.user();
  }
});
