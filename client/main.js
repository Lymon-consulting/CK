/*Imports for configuration*/
import '../imports/startup/client/accounts-config.js';
import '../imports/startup/client/alerts-config.js';
import '../imports/layouts/mainLayout.js';


/*Imports for the template*/
import '../imports/ui/header.html';
import '../imports/ui/banner.html';
import '../imports/ui/footer.html';

/*Imports for pages*/
import '../imports/ui/home.html';
import '../imports/ui/userPage.html';
import '../imports/ui/userPage.js';
import '../imports/ui/userProjects.js';

/*Imports for routing*/
import '/lib/router.js';



Template.registerHelper('profilePicture', function () {
    return Images.find({'owner': Meteor.userId()});
});