import { Random } from 'meteor/random'
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
    updateProfileType(userId,type){
      Meteor.users.update({'_id': userId},{
        $set:{"profileType":type}
      });
    },
    setIsCrew(userId,val){
      Meteor.users.update({'_id': userId},{
        $set:{"isCrew":val}
      });
    },
    setIsCast(userId,val){
      Meteor.users.update({'_id': userId},{
        $set:{"isCast":val}
      });
    },
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
    updatePreferedName(userId, value){
      Meteor.users.update({'_id': userId},{
        $set:{"showArtisticName": value}
      });
    },
    updateGender(userId, value){
      Meteor.users.update({'_id': userId},{
        $set:{"sex": value}
      });
    },
    updateBeard(userId, value){
      Meteor.users.update({'_id': userId},{
        $set:{"beard": value}
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
    updateImdbPage(userId,imdb_page){
      Meteor.users.update({'_id': userId},{
        $set:{"imdb":imdb_page}
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
    updateVimeoPageCrew(userId,vimeo_page){
      Meteor.users.update({'_id': userId},{
        $set:{"vimeoCrew":vimeo_page}
      });
    },
    updateYoutubePageCrew(userId,youtube_page){
      Meteor.users.update({'_id': userId},{
        $set:{"youtubeCrew":youtube_page}
      });
    },
    updateInstagramPage(userId,instagram_page){
      Meteor.users.update({'_id': userId},{
        $set:{"instagram":instagram_page}
      });
    },
    updateIMDBPage(userId,imdb_page){
      Meteor.users.update({'_id': userId},{
        $set:{"imdbCrew":imdb_page}
      });
    },
    updateFullName(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"fullname":value}
      });
    },
    updateArtisticName(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"artistic":value}
      });
    },
    updateHeight(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"height":value}
      });
    },
    updateAge(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"ageRange":value}
      });
    },
    updatePhysical(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"physical":value}
      });
    },
    updateEthnicity(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"ethnicity":value}
      });
    },
    updateEyes(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"eyes":value}
      });
    },
    updateHair(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"hair":value}
      });
    },
    updateTypeOfHair(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"hairType":value}
      });
    },
    addLanguage(userId, value){
      Meteor.users.update({'_id': userId}, 
      {
        $addToSet: {
          "languages": value
        }
      });
    },
    removeLanguage(userId, value){
      Meteor.users.update({'_id': userId}, 
      {
        $pull: {
          "languages": value
        }
      });
    },
    addCategory(userId, value){
      Meteor.users.update({'_id': userId}, 
      {
        $addToSet: {
          "categories": value
        }
      });
    },
    removeCategory(userId, value){
      Meteor.users.update({'_id': userId}, 
      {
        $pull: {
          "categories": value
        }
      });
    },
    updatePeculiarities(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"peculiarities":value}
      });
    },
    updateSkills(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"skills":value}
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
    },
    addGalleryCast(userId,mediaId){
      Meteor.users.update({'_id': userId}, 
      {
        $addToSet: {
          "gallery": mediaId
        }
      });
    },
    removeGalleryCast(userId,mediaId){
      Meteor.users.update({'_id': userId}, 
        {
          $pull: {
            "gallery": mediaId
          }
        });
    },
    addAlert(userId,msg,from,type,projectId,companyId){
      var date = new Date();
      var alert = {
        '_id': Random.id(),
        'read': false,
        'date': date,
        'message': msg,
        'from': from,
        'type': type,
        'projectId': projectId,
        'companyId': companyId
      }
      Meteor.users.update({'_id': userId}, 
        {
          $addToSet: {
            "alerts": alert
          }
        });
    },
    removeAlert(userId,alertId){
      Meteor.users.update({'_id': userId}, 
        {
          $pull: {
            "alerts": alertId
          }
        });
    },
    markAlertAsRead(userId,alertId,read){
      /*var alert = {
        '_id': alertId,
        'read': read
      }*/
      Meteor.users.update({'_id': userId,'alerts._id':alertId}, 
        {
          $set: {
            'alerts.$.read': read
          }
        });
    },

  });