FlowRouter.route('/', {
   name: 'home',
      action: function() {
      BlazeLayout.render('mainlayout', {header: 'header', main: 'peopleList', footer: 'footer'});
   }
});

FlowRouter.route('/people/:id', {
    action: function(params, queryParams) {
        BlazeLayout.render('mainlayout', {header: 'header', main: 'userPage', footer: 'footer'});
        console.log("Yeah! We are on the post:", params.id);
    }
});