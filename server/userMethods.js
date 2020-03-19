import { Ocupation } from '../imports/api/ocupations.js';

Meteor.methods({
  sendVerificationLink() {
    let userId = Meteor.userId();
    if ( userId ) {
    	console.log("Enviando correo en sendVerificationLink dentro de server/userMethods");
      return Accounts.sendVerificationEmail( userId );
    }
  },
  sendResetPasswordEmail(userId) {
    //let userId = Meteor.userId();
    if ( userId!=null ) {
      return Accounts.sendResetPasswordEmail( userId );
    }
  },
  hideWizard(){
  	Meteor.users.update({'_id': Meteor.userId()}, {
			$set:
				{
					"wizard": false
				}
		});
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
	saveMedia(userId, fileId, size, type, name, width, height){

		var date = new Date(Date.now());

		
		var fileData = {
	      "_id" : fileId,
	      "media_title": "",
	      "media_desc": "",
	      "media_size": size,
	      "media_type": type,
	      "media_name": name,
	      "media_date": date,
	      "media_width": width,
	      "media_height": height
	    };

		Meteor.users.upsert(
	       {'_id': userId},
	       { $push: { media: fileData }
	     });
	},
	updateMediaTitle(userId, mediaId, title){
		Meteor.users.update(
	       {'_id': userId, 'media._id': mediaId},
	       { $set: { 'media.$.media_title': title }
	     });
	},
	updateMediaDescription(userId, mediaId, description){
		Meteor.users.update(
	       {'_id': userId, 'media._id': mediaId},
	       { $set: { 'media.$.media_desc': description }
	     });
	},

	deleteMedia(userId, mediaId){
		var fileData = {
	      "_id" : mediaId
	    };

		Meteor.users.upsert(
	       {'_id': userId},
	       { $pull: { media: fileData }
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
	},
	removeFollowTo(userId, followsToId){
		Meteor.users.update({'_id': userId}, 
		{
			$pull: {
            	"follows": followsToId
            }
     	});
	},
	addLikesProject(userId, projectId){
		Meteor.users.update({'_id': userId}, 
			{
				$addToSet: {
	            	"likesProject": projectId
	            }
         });
	},

	removeLikesProject(userId,projectId){
	  Meteor.users.update({'_id': userId}, 
		{
			$pull: {
            	"likesProject": projectId
            }
     });	
	}
	


});