import { Template } from 'meteor/templating';

import './selectProfile.html';

Template.selectProfile.events({
	'click #saveProfile': function(event, template){
		event.preventDefault();
		var element = template.find('input:radio[name=profileSelection]:checked');
		var value = $(element).val();

		
		if(value==="1"){
			Meteor.call('addRole',Meteor.userId(),"Director");
		}
		else if(value==="2"){
			Meteor.call('addRole',Meteor.userId(),"Productor");
		}
		else if(value==="3"){
			Meteor.call('addRole',Meteor.userId(),"Director");
			Meteor.call('addRole',Meteor.userId(),"Productor");
		}

    	FlowRouter.go('/editProfile/' + Meteor.userId());

	}
});