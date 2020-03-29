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

    updateName(userId,name){
      Meteor.users.update({'_id': userId},{
        $set:{"profile.name":name}
      });
    },
    updateLastName(userId,lastname){
      Meteor.users.update({'_id': userId},{
        $set:{"profile.lastname":lastname}
      });
    },
    updateLastName2(userId,lastname2){
      Meteor.users.update({'_id': userId},{
        $set:{"profile.lastname2":lastname2}
      });
    },
    updateResume(userId,resume){
      Meteor.users.update({'_id': userId},{
        $set:{"resume":resume}
      });
    },
    updateCountry(userId,country){
      Meteor.users.update({'_id': userId},{
        $set:{"country":country}
      });
    },
    updateState(userId,state){
      Meteor.users.update({'_id': userId},{
        $set:{"state":state}
      });
    },
    updateCity(userId,city){
      Meteor.users.update({'_id': userId},{
        $set:{"city":city}
      });
    },
    updateWebPage(userId,web_page){
      Meteor.users.update({'_id': userId},{
        $set:{"webpage":web_page}
      });
    },
    updateFacebookPage(userId,facebook_page){
      Meteor.users.update({'_id': userId},{
        $set:{"facebook":facebook_page}
      });
    },
    updateTwitterPage(userId,twitter_page){
      Meteor.users.update({'_id': userId},{
        $set:{"twitter":twitter_page}
      });
    },
    updateVimeoPage(userId,vimeo_page){
      Meteor.users.update({'_id': userId},{
        $set:{"vimeo":vimeo_page}
      });
    },
    updateYoutubePage(userId,youtube_page){
      Meteor.users.update({'_id': userId},{
        $set:{"youtube":youtube_page}
      });
    },
    updateInstagramPage(userId,instagram_page){
      Meteor.users.update({'_id': userId},{
        $set:{"instagram":instagram_page}
      });
    },
    updateFullName(userId,fullname){
      Meteor.users.update({'_id': userId},{
        $set:{"fullname":fullname}
      });
    },

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
    
    
    updateProfilePicture(userId, mediaId){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "profilePictureID": mediaId
        }
      });
    },
    updateCoverPicture(userId, mediaId){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "profileCoverID": mediaId
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