import { Meteor } from 'meteor/meteor';
import '../imports/api/people.js';
import '../imports/startup/server/on-create-user.js';

Meteor.startup(() => {
  // code to run on server at startup
});
