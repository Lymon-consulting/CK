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

	saveProfilePictureID(userId, profilePictureID){
		Meteor.users.update({'_id': userId}, {
			$set:
				{
					"profilePictureID": profilePictureID
				}
		});
	},
	saveProfileCoverID(userId, profileCoverID){
		Meteor.users.update({'_id': userId}, {
			$set:
				{
					"profileCoverID": profileCoverID
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
	},
	addFollowTo(followerId, followsToId){
		Meteor.users.update(
         {'_id': followerId},
         { $addToSet: { 'follows': followsToId } }
      );
	}
	


});