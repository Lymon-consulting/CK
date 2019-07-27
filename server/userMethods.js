import { Ocupation } from '../imports/api/ocupations.js';

Meteor.methods({
  sendVerificationLink() {
    let userId = Meteor.userId();
    if ( userId ) {
    	console.log("Enviando correo");
      return Accounts.sendVerificationEmail( userId );
    }
  },
  sendResetPasswordEmail(userId) {
    //let userId = Meteor.userId();
    if ( userId!=null ) {
      return Accounts.sendResetPasswordEmail( userId );
    }
  }
});



/*
Meteor.methods({
  sendVerificationLink() {
    let userId = Meteor.userId();
    if ( userId ) {
      console.log("Email has been sent");
      Meteor.setTimeout(function() {
          return Accounts.sendVerificationEmail(user._id);
      }, 2 * 4000);
      
    }
  }
});*/

/*
Accounts.onCreateUser(function(options, user) {
      user.profile = {};

      // we wait for Meteor to create the user before sending an email
      Meteor.setTimeout(function() {
          Accounts.sendVerificationEmail(user._id);
      }, 2 * 1000);

      return user;
  });
*/
Meteor.methods({

	updateUser(userId, name, lastname, lastname2, city, state, country, resume, fullname, webpage, facebook, twitter, vimeo, youtube, instagram){
		
		Meteor.users.update({'_id': userId}, {
			$set: 
               {"profile.name": name, 
                "profile.lastname": lastname, 
                "profile.lastname2": lastname2,
                "city" : city,
                "state" : state,
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
	deleteCover(userId, profileCoverID){
		Meteor.users.update({'_id': userId}, {
			$set:
				{
					"profileCoverID": null
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