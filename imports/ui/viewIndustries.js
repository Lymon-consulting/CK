import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import './viewIndustries.html';

Meteor.subscribe('myIndustries');

Template.industryList.helpers({
  myIndustries(){      
   Meteor.subscribe('myIndustries');
   return Industry.find({'userId':FlowRouter.getParam('id')}).fetch();
  },
  getCompanyLogo(companyId, size) {
          var url = "";
          var data = Industry.findOne({'_id' : companyId});
          if(data!=null && data.companyLogoID!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.companyLogoID;
          }
         return url;
      }
});