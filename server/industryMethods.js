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
  },
  addCompanyName(company_name, userId){
    return Industry.insert({
      "company_name": company_name,
      "userId": userId
    });
  },
  'updateCompanyType'(companyId, type){
    Industry.update({'_id':companyId},{
      $set:
      {
        "company_type":type
      }
    });
  },
  'updateCompanyDesc'(companyId, company_desc){
    Industry.update({'_id':companyId},{
      $set:
      {
        "company_desc":company_desc
      }
    });
  },
  'updateCompanyYear'(companyId, company_year){
    Industry.update({'_id':companyId},{
      $set:
      {
        "company_year":company_year
      }
    });
  },
  'updateCompanyWeb'(companyId, company_web_page){
    Industry.update({'_id':companyId},{
      $set:
      {
        "company_web_page":company_web_page
      }
    });
  },
  'updateCompanyFacebook'(companyId, company_facebook_page){
    Industry.update({'_id':companyId},{
      $set:
      {
        "company_facebook_page":company_facebook_page
      }
    });
  },
  'updateCompanyTwitter'(companyId, company_twitter_page){
    Industry.update({'_id':companyId},{
      $set:
      {
        "company_twitter_page":company_twitter_page
      }
    });
  },
  'updateCompanyVimeo'(companyId, company_vimeo_page){
    Industry.update({'_id':companyId},{
      $set:
      {
        "company_vimeo_page":company_vimeo_page
      }
    });
  },
  'updateCompanyYoutube'(companyId, company_youtube_page){
    Industry.update({'_id':companyId},{
      $set:
      {
        "company_youtube_page":company_youtube_page
      }
    });
  },
  'updateCompanyInstagram'(companyId, company_instagram_page){
    Industry.update({'_id':companyId},{
      $set:
      {
        "company_instagram_page":company_instagram_page
      }
    });
  },
  updateCompanyCountry(companyId,country){
    Industry.update({'_id': companyId},{
      $set:{"country":country}
    });
  },
  updateCompanyState(companyId,state){
    Industry.update({'_id': companyId},{
      $set:{"state":state}
    });
  },
  updateCompanyCity(companyId,city){
    Industry.update({'_id': companyId},{
      $set:{"city":city}
    });
  },
});