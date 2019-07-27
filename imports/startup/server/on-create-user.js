import { Validator}  from 'validator';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/*
Accounts.onCreateUser((options,user) => {
   const newUser = user;
   if(validator.isEmail(options.email)){
      if(options.profile) newUser.profile = options.profile;
      return newUser;
   }

   throw new Meteor.Error('500', 'Proporcione un email válido');
});*/

Accounts.onCreateUser(function(options, user) {
   const newUser = user;
   
   if(options.profile){ 
      newUser.profile = options.profile;
   }
   
   return newUser;
   
   //throw new Meteor.Error('500', 'Proporcione un email válido');
});

/*
Accounts.onEmailVerificationLink(function (token, done) {
  Accounts.verifyEmail(token, function (error) {
    if (error) {
      console.log(error);
    }
    done();
  });
});*/