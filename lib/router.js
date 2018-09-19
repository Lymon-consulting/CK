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
        console.log("Yeah! We are on the post:", params.id);
    }
});