import { Ocupation } from '../imports/api/ocupations.js';

Meteor.methods({

	updateUser(userId, name, lastname, lastname2, city, country, resume, fullname, webpage, facebook, twitter, vimeo, youtube, instagram){
		
		Meteor.users.update({'_id': userId}, {
			$set: 
               {"profile.name": name, 
                "profile.lastname": lastname, 
                "profile.lastname2": lastname2,
                "profile.city" : city,
                "profile.country" : country,
                "profile.resume" : resume,
                "profile.fullname": fullname,
                "profile.webpage": webpage, 
	            "profile.facebook": facebook,
	            "profile.twitter": twitter,
	            "profile.vimeo": vimeo,
	            "profile.youtube": youtube,
	            "profile.instagram": instagram
               }
            });
	},

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