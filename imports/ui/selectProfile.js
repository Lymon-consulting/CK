import { Template } from 'meteor/templating';

import './selectProfile.html';

Template.selectProfile.events({
	'click .setProfile': function(event, template){
		event.preventDefault();
		var optionSelected = $(event.target).attr("data-answer");
		if(optionSelected==='crew'){
			Meteor.call('updateProfileType', Meteor.userId(), 'crew'); 
			FlowRouter.go('/confirmProfile/crew' + Meteor.userId());	
		}
		else if(optionSelected==='industry'){
			Meteor.call('updateProfileType', Meteor.userId(), 'crew'); 
			FlowRouter.go('/confirmProfile/industry' + Meteor.userId());	
		}
		else if(optionSelected==='cast'){
			Meteor.call('updateProfileType', Meteor.userId(), 'cast'); 
			FlowRouter.go('/editProfileActor/' + Meteor.userId());	
		}

    	

	}
});