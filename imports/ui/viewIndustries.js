import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Media } from '../api/media.js';
import './viewIndustries.html';

Meteor.subscribe('myIndustries');

Template.industryList.helpers({
  myIndustries(){      
   Meteor.subscribe('myIndustries');
   return Industry.find({'userId':FlowRouter.getParam('id')}).fetch();
  },
  getCompanyLogo(companyId, size) {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : companyId});
    var url;
    if(data!=null && data.companyLogoID!=null){
      var cover = Media.findOne({'mediaId':data.companyLogoID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_250,c_scale" + "/v" + cover.media_version + "/" + Meteor.userId() + "/" + data.companyLogoID;    
      }
      
    }
    return url;
  }
});