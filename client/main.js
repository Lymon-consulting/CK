/*Imports for configuration*/
import '../imports/startup/client/accounts-config.js';
import '../imports/layouts/mainLayout.js';

/*Imports for the template*/
import '../imports/ui/header.html';
import '../imports/ui/banner.html';
import '../imports/ui/footer.html';

/*Imports for pages*/
import '../imports/ui/addCollaborator.js';
import '../imports/ui/addCollaboratorIndustry.js';
import '../imports/ui/ads.js';
import '../imports/ui/blog.js';
import '../imports/ui/collaborations.js';
import '../imports/ui/confirmProfile.js';
import '../imports/ui/contact.js';
import '../imports/ui/editIndustry.js';
import '../imports/ui/editMedia.js';
import '../imports/ui/editProfile.js';
import '../imports/ui/editProfileCast.js';
import '../imports/ui/editProfileActor.js';
import '../imports/ui/editProject.js';
import '../imports/ui/faq.js';
import '../imports/ui/header.js';
import '../imports/ui/home.html';
import '../imports/ui/industryList.js';
import '../imports/ui/industryName.js';
import '../imports/ui/industryPage.js';
import '../imports/ui/job.js';
import '../imports/ui/join.js';
import '../imports/ui/login.js';
import '../imports/ui/mediaEditor.js';
import '../imports/ui/messageIcon.js';
import '../imports/ui/messages.js';
import '../imports/ui/notificationList.js';
import '../imports/ui/notifications.js';
import '../imports/ui/peopleList.js';
import '../imports/ui/peopleListCast.js';
import '../imports/ui/projectName.js';
import '../imports/ui/projectPage.js';
import '../imports/ui/profilePage.js';
import '../imports/ui/profilePageActor.js';
import '../imports/ui/projList.js';
import '../imports/ui/recover.js';
import '../imports/ui/searchCastForProject.js';
import '../imports/ui/searchCollaboratorForIndustry.js';
import '../imports/ui/searchCollaboratorForProject.js';
import '../imports/ui/searchIndustryForProject.js';
import '../imports/ui/selectProfile.js';
import '../imports/ui/terms.js';
import '../imports/ui/thanksRegister.js';
import '../imports/ui/userProjects.js';
import '../imports/ui/verify.js';
import '../imports/ui/viewIndustries.js';
import '../imports/ui/viewProjects.js';

/*Imports for routing*/
import '/lib/router.js';

Meteor.startup(() => {

  //cloudinary.setCloudName("my-cloud");

});

Accounts.config({
  /*Habilitar este valor con true para enviar un correo de verificación al crear un usuario*/
  sendVerificationEmail: false
});

/*
Accounts.onResetPasswordLink(
  function(token, done){
      console.log("passwordToken", token);
      //Session.set("passwordToken", token);
      //Accounts.resetPassword(token, "password");
      done();
      //FlowRouter.go('/changePassword', {_id: 1}, {query: 'token=' + token});
      //Router.go('appCreatePassword',{query: 'token=' + token});
      //Router.go('appCreatePassword',{_id: 1}, {query: 'token=' + token});


  });
*/

Bert.defaults = {
  hideDelay: 2500,
  // Accepts: a number in milliseconds.
  style: 'growl-top-right',
  // Accepts: fixed-top, fixed-bottom, growl-top-left,   growl-top-right,
  // growl-bottom-left, growl-bottom-right.
  type: 'info',
  // Accepts: default, success, info, warning, danger.
  title: 'Mensaje de Cinekomuna'
};

Template.registerHelper('profilePicture', function () {
    Meteor.subscribe("images");
    return Images.find({'owner': Meteor.userId()});
});
