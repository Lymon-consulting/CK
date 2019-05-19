FlowRouter.route('/', {
   name: 'home',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'home', footer: 'footer'});
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
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'userPage', footer: 'footer'});
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
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'userEditProject', footer: 'footer', data: params.id});
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