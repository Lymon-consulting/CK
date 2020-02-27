import { Industry } from '../imports/api/industry.js';
import { Portlet } from '../imports/api/portlet.js';


Meteor.methods({
   
  insertCompany(userId, company_name, company_type, company_desc, company_year, company_web_page, company_facebook_page, company_twitter_page, company_vimeo_page, company_youtube_page, company_instagram_page){
    return Industry.insert({
      "company_name": company_name,
      "company_type": company_type,
      "company_desc": company_desc, 
      "company_year": company_year,
      "company_web_page": company_web_page,
      "company_facebook_page": company_facebook_page,
      "company_twitter_page": company_twitter_page,
      "company_vimeo_page": company_vimeo_page,
      "company_youtube_page": company_youtube_page,
      "company_instagram_page": company_instagram_page,
      "userId": userId
     },function(error,result){
        return result;
     });
  },
  updateCompany(companyId, company_name, company_type, company_desc, company_year, company_web_page, company_facebook_page, company_twitter_page, company_vimeo_page, company_youtube_page, company_instagram_page){
    Industry.update({_id: companyId},{
      $set:{
        "company_name": company_name,
        "company_type": company_type,
        "company_desc": company_desc, 
        "company_year": company_year,
        "company_web_page": company_web_page,
        "company_facebook_page": company_facebook_page,
        "company_twitter_page": company_twitter_page,
        "company_vimeo_page": company_vimeo_page,
        "company_youtube_page": company_youtube_page,
        "company_instagram_page": company_instagram_page
     }});
  },
  saveCompanyLogoID(companyId, companyLogoID){
    Industry.update({'_id': companyId}, {
      $set:
        {
          "companyLogoID": companyLogoID
        }
    });
  },
  saveCompanyCoverID(companyId, companyCoverID){
    Industry.update({'_id': companyId}, {
      $set:
        {
          "companyCoverID": companyCoverID
        }
    });
  },
  deleteCompanyLogo(companyId, companyLogoID){
    Industry.update({'_id': companyId}, {
      $set:
        {
          "companyLogoID": null
        }
    }); 
  },
  deleteCompanyCover(companyId, companyCoverID){
    Industry.update({'_id': companyId}, {
      $set:
        {
          "companyCoverID": null
        }
    }); 
  }
  
});