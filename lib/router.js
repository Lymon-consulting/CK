FlowRouter.route('/', {
   name: 'home',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'home', footer: 'footer'});
   }
});

FlowRouter.route('/login', {
   name: 'login',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'login', footer: 'footer'});
   }
});

FlowRouter.route('/join', {
   name: 'join',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'join', footer: 'footer'});
   }
});

FlowRouter.route('/thanksRegister', {
   name: 'thanksRegister',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'thanksRegister', footer: 'footer'});
   }
});

FlowRouter.route('/confirmProfile/:id', {
   name: 'thanksRegister',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'confirmProfile', footer: 'footer'});
   }
});

FlowRouter.route('/peopleList', {
   name: 'peopleList',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'peopleList', footer: 'footer'});
   }
});

FlowRouter.route('/projList', {
   name: 'projList',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'projList', footer: 'footer'});
   }
});


FlowRouter.route('/profilePage/:id', {
    action: function(params, queryParams) {
        //Session.set('userID',params.id);
        BlazeLayout.render('mainlayout', {header: 'header',  main: 'profilePage', footer: 'footer'});
    }
});


FlowRouter.route('/editProfile/:id', {
    action: function(params, queryParams) {
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'editProfile', footer: 'footer'});
    }
});

FlowRouter.route('/addProject/:id', {
    action: function(params, queryParams) {
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'userProjects', footer: 'footer'});
    }
});

FlowRouter.route('/editProject/:id', {
    action: function(params, queryParams) {
        Session.set('projID',params.id);
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'editProject', footer: 'footer', data: params.id});
    }
});

FlowRouter.route('/viewProjects/:id', {
    action: function(params, queryParams) {
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'viewProjects', footer: 'footer'});
    }
});

FlowRouter.route('/projectPage/:id', {
    action: function(params, queryParams) {
        BlazeLayout.render('mainlayout', {header: 'header', main: 'projectPage', footer: 'footer'});
    }
});

FlowRouter.route('/contact', {
   name: 'contact',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'contact', footer: 'footer'});
   }
});

FlowRouter.route('/blog', {
   name: 'blog',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'blog', footer: 'footer'});
   }
});

FlowRouter.route('/job', {
   name: 'job',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'job', footer: 'footer'});
   }
});

FlowRouter.route('/faq', {
   name: 'faq',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'faq', footer: 'footer'});
   }
});

FlowRouter.route('/ads', {
   name: 'ads',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'ads', footer: 'footer'});
   }
});

FlowRouter.route('/terms', {
   name: 'terms',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'terms', footer: 'footer'});
   }
});

FlowRouter.route('/recover', {
   name: 'recover',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'recover', footer: 'footer'});
   }
});

FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        FlowRouter.go( '/' );
        Bert.alert({message: 'El enlace no es válido, vuelve a solicitar un enlace de verificación', type: 'danger', icon: 'fa fa-check'});
        console.log(error.reason);
      } else {
        FlowRouter.go( '/confirmProfile/' + Meteor.userId());
        Bert.alert({message: 'Tu correo ha sido verificado, muchas gracias', type: 'success', icon: 'fa fa-check'});
      }
    });
  }
});

FlowRouter.route('/reset-password/:token/:newPassword', {
  name: 'reset-password',
  action( params ) {
   // console.log("Token="+params.token);
    Accounts.resetPassword( params.token, params.newPassword, ( error ) =>{
      if ( error ) {
        FlowRouter.go( '/' );
        Bert.alert({message: 'El enlace no es válido, vuelve a solicitar un enlace para restablcer tu contraseña', type: 'danger', icon: 'fa fa-check'});
        console.log(error.reason);
      } else {
        FlowRouter.go( '/' );
        Bert.alert({message: 'Tu contraseña ha sido actualizada', type: 'success', icon: 'fa fa-check'});
      }
    });
  }
});


/*
FlowRouter.route( '/changePassword', {
  name: 'verify-email',
  action( params ) {
    FlowRouter.go( '/changePassword' );
  }
});
*/

