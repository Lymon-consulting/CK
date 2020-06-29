import { Accounts } from 'meteor/accounts-base';

Meteor.logout(function(err) {
  console.log("En logout en accounts-config.js");
  FlowRouter.go("/home");
});


