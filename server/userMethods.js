import { Ocupation } from '../imports/api/ocupations.js';

Meteor.methods({

	updateUser(userId, name, lastname, lastname2, city, country, resume, fullname, webpage, facebook, twitter, vimeo, youtube, instagram){
		
		Meteor.users.update({'_id': userId}, {
			$set: 
               {"profile.name": name, 
                "profile.lastname": lastname, 
                "profile.lastname2": lastname2,
                "city" : city,
                "country" : country,
                "resume" : resume,
                "fullname": fullname,
                "webpage": webpage, 
	            "facebook": facebook,
	            "twitter": twitter,
	            "vimeo": vimeo,
	            "youtube": youtube,
	            "instagram": instagram
               }
            });
	},

	addRole(userId, role){
		Meteor.users.update({'_id': userId}, 
			{
				$addToSet: {
	            	"role": role
	            }
         });
	},
	removeRole(userId, role){
		Meteor.users.update({'_id': userId}, 
			{
				$pull: {
	            	"role": role
	            }
         });
	}


});