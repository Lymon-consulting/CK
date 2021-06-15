import { Random } from 'meteor/random'
import { Ocupation } from '../imports/api/ocupations.js';
import { Alert } from '../imports/api/alert.js';

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
  },
  getServerDate(){
    return new Date();
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
    /*updateProfileType(userId,type){
      Meteor.users.update({'_id': userId},{
        $set:{"profileType":type}
      });
    },*/

    /*Datos genéricos del usuario*/
    setIsCrew(userId,val){
      Meteor.users.update({'_id': userId},{
        $set:{
          "isCrew":val,
          "viewAs":1 // 1=crew, 2=cast
        }
      });
    },
    setIsCast(userId,val){
      Meteor.users.update({'_id': userId},{
        $set:{
          "isCast":val,
          "viewAs":2 // 1=crew, 2=cast
        }
      });
    },
    setViewAs(userId,val){
      Meteor.users.update({'_id': userId},{
        $set:{
          "viewAs":val // 1=crew, 2=cast
        }
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
    updateFullName(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"fullname":value}
      });
    },
    addTopRole(userId, role){
      Meteor.users.update({'_id': userId}, 
      {
        $addToSet: {
          "topRole": role
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
    addLikesPeople(userId, peopleId){
      Meteor.users.update({'_id': userId}, 
      {
        $addToSet: {
          "likesPeople": peopleId
        }
      });
    },

    removeLikesPeople(userId,peopleId){
      Meteor.users.update({'_id': userId}, 
      {
        $pull: {
          "likesPeople": peopleId
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
    
    addAlert(userId,msg,from,type,projectId,companyId){
      console.log(userId);
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
      console.log("Agregando alerta para "+userId +" con " +alert.toString());
      Meteor.users.update({'_id': userId}, 
        {
          $addToSet: {
            "alerts": alert
          }
        });
    },

    sendAlert(sender, receiver, message, entityId, entityType){
      var date = new Date();
      var alert = {
        sender: sender,
        receiver: receiver,
        message: message,
        date: date,
        read: false,
        entityId: entityId,
        entityType: entityType
      }
      
      return Alert.insert(alert, function(error, result){
        if(!error){
          return result;
        }
        else{
          return error;
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
    markAlertAsRead(alertId,read){
      Alert.update({'_id':alertId}, 
        {
          $set: {
            'read': read
          }
        });
    },

    /*Datos específicos para cast*/
    updateCastArtisticName(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.artistic":value}
      });
    },
    updateCastPreferedName(userId, value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.showArtisticName": value}
      });
    },
    addCastCategory(userId, value){
      Meteor.users.update({'_id': userId}, 
      {
        $addToSet: {
          "cast.categories": value
        }
      });
    },
    removeCastCategory(userId, value){
      Meteor.users.update({'_id': userId}, 
      {
        $pull: {
          "cast.categories": value
        }
      });
    },
    updateCastGender(userId, value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.sex": value}
      });
    },
    updateCastAge(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.ageRange":value}
      });
    },
    updateCastResume(userId,resume){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.resume":resume}
      });
    },
    updateCastHeight(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.height":value}
      });
    },
    
    updateCastPhysical(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.physical":value}
      });
    },
    updateCastEthnicity(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.ethnicity":value}
      });
    },
    updateCastEyes(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.eyes":value}
      });
    },
    updateCastHair(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.hair":value}
      });
    },
    updateCastTypeOfHair(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.hairType":value}
      });
    },
    updateCastBeard(userId, value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.beard": value}
      });
    },
    updateCastPeculiarities(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.peculiarities":value}
      });
    },
    updateCastSkills(userId,value){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.skills":value}
      });
    },
    addCastLanguage(userId, value){
      Meteor.users.update({'_id': userId}, 
      {
        $addToSet: {
          "cast.languages": value
        }
      });
    },
    removeCastLanguage(userId, value){
      Meteor.users.update({'_id': userId}, 
      {
        $pull: {
          "cast.languages": value
        }
      });
    },
    updateCastVimeoPage(userId,vimeo_page){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.vimeo":vimeo_page}
      });
    },
    updateCastYoutubePage(userId,youtube_page){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.youtube":youtube_page}
      });
    },
    updateCastVimeoDemo(userId,vimeo_demo){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.vimeo_demo":vimeo_demo}
      });
    },
    updateCastYoutubeDemo(userId,youtube_demo){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.youtube_demo":youtube_demo}
      });
    },
    updateCastFacebookPage(userId,facebook_page){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.facebook":facebook_page}
      });
    },
    updateCastInstagramPage(userId,instagram_page){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.instagram":instagram_page}
      });
    },
    updateCastImdbPage(userId,imdb_page){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.imdb":imdb_page}
      });
    },
    updateCastTwitterPage(userId,twitter_page){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.twitter":twitter_page}
      });
    },
    updateCastVimeoPage(userId,vimeo_page){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.vimeo":vimeo_page}
      });
    },
    updateCastYoutubePage(userId,youtube_page){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.youtube":youtube_page}
      });
    },
    updateCastWebPage(userId,web_page){
      Meteor.users.update({'_id': userId},{
        $set:{"cast.webpage":web_page}
      });
    },
    addGalleryCast(userId,mediaId){
      Meteor.users.update({'_id': userId}, 
      {
        $addToSet: {
          "cast.gallery": mediaId
        }
      });
    },
    removeGalleryCast(userId,mediaId){
      Meteor.users.update({'_id': userId}, 
      {
        $pull: {
          "cast.gallery": mediaId
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
    saveCastProfilePictureID(userId, profilePictureID){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "cast.profilePictureID": profilePictureID
        }
      });
    },
    saveCastProfileCoverID(userId, profileCoverID){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "cast.profileCoverID": profileCoverID
        }
      });
    },
    deleteCastCover(userId, profileCoverID){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "cast.profileCoverID": null
        }
      }); 
    },
    
    
    /*Datos específicos de crew*/
    updateCrewResume(userId,resume){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.resume":resume}
      });
    },
    updateCrewWebPage(userId,web_page){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.webpage":web_page}
      });
    },
    updateCrewFacebookPage(userId,facebook_page){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.facebook":facebook_page}
      });
    },
    updateCrewTwitterPage(userId,twitter_page){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.twitter":twitter_page}
      });
    },
    updateCrewVimeoPage(userId,vimeo_page){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.vimeo":vimeo_page}
      });
    },
    updateCrewYoutubePage(userId,youtube_page){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.youtube":youtube_page}
      });
    },
    updateCrewInstagramPage(userId,instagram_page){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.instagram":instagram_page}
      });
    },
    updateCrewIMDBPage(userId,imdb_page){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.imdb":imdb_page}
      });
    },
    updateVimeoPageCrew(userId,vimeo_page){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.vimeoDemo":vimeo_page}
      });
    },
    updateYoutubePageCrew(userId,youtube_page){
      Meteor.users.update({'_id': userId},{
        $set:{"crew.youtubeDemo":youtube_page}
      });
    },
    updateCrewProfilePicture(userId, mediaId){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "crew.profilePictureID": mediaId
        }
      });
    },
    updateCrewCoverPicture(userId, mediaId){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "crew.profileCoverID": mediaId
        }
      });
    },
    updateCastCoverPicture(userId, mediaId){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "cast.profileCoverID": mediaId
        }
      });
    },
    saveCrewProfilePictureID(userId, profilePictureID){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "crew.profilePictureID": profilePictureID
        }
      });
    },
    saveCrewProfileCoverID(userId, profileCoverID){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "crew.profileCoverID": profileCoverID
        }
      });
    },
    deleteCrewCover(userId, profileCoverID){
      Meteor.users.update({'_id': userId}, {
        $set:
        {
          "crew.profileCoverID": null
        }
      }); 
    },

    
/*
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
    },*/
    
    
    

    

    
    

  });