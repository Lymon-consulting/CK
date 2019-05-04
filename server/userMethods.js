import { Ocupation } from '../imports/api/ocupations.js';

Meteor.methods({

	addRole(userId, role){
		Meteor.users.update({'_id': userId}, 
			{
				$addToSet: {
	            	"profile.role": role
	            }
         });
	},
	removeRole(userId, role){
		Meteor.users.update({'_id': userId}, 
			{
				$pull: {
	            	"profile.role": role
	            }
         });
	}


});