import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
 
import './header.html';
import '/lib/common.js';

Template.header.helpers({
  user(){
      return = Meteor.user();
  }
});
