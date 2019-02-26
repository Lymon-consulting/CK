/*Imports for configuration*/
import '../imports/startup/client/accounts-config.js';
import '../imports/layouts/mainLayout.js';


/*Imports for the template*/
import '../imports/ui/header.html';
import '../imports/ui/banner.html';
import '../imports/ui/footer.html';

/*Imports for pages*/
import '../imports/ui/home.html';
/*import '../imports/ui/userPage.html';*/
import '../imports/ui/header.js';
import '../imports/ui/userPage.js';
import '../imports/ui/userProjects.js';
import '../imports/ui/userEditProject.js';
import '../imports/ui/viewProjects.js';
import '../imports/ui/peopleList.js';
import '../imports/ui/profilePage.js';
import '../imports/ui/projectPage.js';



/*Imports for routing*/
import '/lib/router.js';

Bert.defaults = {
  hideDelay: 2500,
  // Accepts: a number in milliseconds.
  style: 'growl-top-right',
  // Accepts: fixed-top, fixed-bottom, growl-top-left,   growl-top-right,
  // growl-bottom-left, growl-bottom-right.
  type: 'default',
  // Accepts: default, success, info, warning, danger.
  title: 'Mensaje de Cinekomuna'
};

Template.registerHelper('profilePicture', function () {
    Meteor.subscribe("images");
    return Images.find({'owner': Meteor.userId()});
});

