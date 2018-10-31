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
      console.log("Aquí la lista de personas:");
   }
});


FlowRouter.route('/people/:id', {
    action: function(params, queryParams) {
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'userPage', footer: 'footer'});
        console.log("Yeah! We are on the post:", params.id);
    }
});


FlowRouter.route('/editProfile/:id', {
    action: function(params, queryParams) {
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'userPage', footer: 'footer'});
        console.log("Editing userId:", params.id);
    }
});

FlowRouter.route('/editProjects/:id', {
    action: function(params, queryParams) {
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'userProjects', footer: 'footer'});
        console.log("Editing projects from userId:", params.id);
    }
});

FlowRouter.route('/viewProjects/:id', {
    action: function(params, queryParams) {
        BlazeLayout.render('mainlayout', {header: 'header', banner:'banner', main: 'viewProjects', footer: 'footer'});
        console.log("Listing projects from userId:", params.id);
    }
});