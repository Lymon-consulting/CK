import { Meteor } from 'meteor/meteor';
import { Params } from '../imports/api/params.js';
import { Project } from '../imports/api/project.js';
import { Industry } from '../imports/api/industry.js';
import { Portlet } from '../imports/api/portlet.js';
import { Ocupation } from '../imports/api/ocupations.js';
import { City } from '../imports/api/city.js';
import { Media } from '../imports/api/media.js';
import { Index, MongoDBEngine } from 'meteor/easy:search'

import '../imports/api/ocupations.js';
import '../imports/startup/server/on-create-user.js';
import './projectMethods.js';
import './userMethods.js';
import './industryMethods.js';
import './mediaMethods.js';


Meteor.startup(() => {
Cloudinary.config({
      cloud_name: Meteor.settings.private.CLOUDINARY_URL,
      api_key: Meteor.settings.private.API_KEY,
      api_secret: Meteor.settings.private.API_SECRET
  });

  process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;


  Meteor.users._ensureIndex({
      "fullname": 1
    });

  Accounts.config({
        sendVerificationEmail: true
    });
  Accounts.emailTemplates.siteName = "Cinekomuna";
  Accounts.emailTemplates.from     = process.env.global_mail_sender;

  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return "[Cinekomuna] Verifica tu cuenta de correo";
    },
    text( user, url ) {
      let emailAddress   = user.emails[0].address;
      let urlWithoutHash = url.replace( '#/', '' );
      let supportEmail   = "soporte@cinekomuna.com";
      emailBody      = `Para verificar tu cuenta (${emailAddress}) visita el siguiente enlace:\n\n${urlWithoutHash}\n\n Si tú no solicitaste esta verificación, por favor ignora este correo. Si crees que algo está mal, por favor contacta a nuestro equipo de soporte: ${supportEmail}.`;

      return emailBody;
    }
  };

  Accounts.emailTemplates.resetPassword = {
    subject() {
      return "[Cinekomuna] Enlace para cambiar tu contraseña";
    },
    text( user, url ) {
      let emailAddress   = user.emails[0].address;
      //let urlWithoutHash = url.replace( '#/', '' );
      let urlWithoutHash = url;
      let supportEmail   = "soporte@cinekomuna.com";
      emailBody      = `Para cambiar tu contraseña visita el siguiente enlace:\n\n${urlWithoutHash}\n\n Si tú no solicitaste esta operación, por favor ignora este correo. Si crees que algo está mal, por favor contacta a nuestro equipo de soporte: ${supportEmail}.`;

      return emailBody;
    }
  };

});

Meteor.publish( 'books', function() {
  return Portlet.find( {}, { sort: { order: 1 } } );
});
 
Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {
          'role': 1, 
          'resume':1, 
          'city':1, 
          'country':1, 
          'facebook':1, 
          'fullname':1, 
          'instagram':1, 
          'twitter':1, 
          'vimeo':1, 
          'webpage':1, 
          'youtube':1, 
          'profilePictureID':1, 
          'profileCoverID':1,
          'wizard' : 1
        }});
});


//const Users = new Mongo.Collection('users');
export const UsersIndex = new Index({
    collection: Meteor.users,
    fields: ['profile.name', 'profile.lastname', 'profile.lastname2', 'emails'],
    engine: new MongoDBEngine({

    selectorPerField: function (field, searchString) {
      if ('emails' === field) {
        // return this selector if the email field is being searched
        return {
          emails: {
            $elemMatch: {
              address: { '$regex' : '.*' + searchString + '.*', '$options' : 'i' }
            },
          },
        }
      }

      // use the default otherwise
      return this.defaultConfiguration().selectorPerField(field, searchString)
    },
    selector: function (searchObject, options, aggregation) {
        const selector = this.defaultConfiguration().selector(searchObject, options, aggregation)

        // modify the selector to only match documents where region equals "New York"
        if (options.search.props.isCrew) {
          selector.isCrew = options.search.props.isCrew;
        }
        if (options.search.props.isCast) {
          selector.isCast = options.search.props.isCast;
        }
        if (options.search.props.city) {
          selector.city = options.search.props.city;
        }
        if (options.search.props.role) {
          selector.role = options.search.props.role;
        }
        if (options.search.props.profileType) {
          selector.profileType = options.search.props.profileType;
        }
        if (options.search.props.categories) {
          selector.categories = options.search.props.categories;
        }
        if (options.search.props.sex) {
          selector.sex = options.search.props.sex;
        }
        if (options.search.props.eyes) {
          selector.eyes = options.search.props.eyes;
        }
        if (options.search.props.hair) {
          selector.hair = options.search.props.hair;
        }
        if (options.search.props.hairType) {
          selector.hairType = options.search.props.hairType;
        }
        if (options.search.props.physical) {
          selector.physical = options.search.props.physical;
        }
        if (options.search.props.ethnicity) {
          selector.ethnicity = options.search.props.ethnicity;
        }
        if (options.search.props.ageRange) {
          selector.ageRange = options.search.props.ageRange;
        }
        if (options.search.props.height) {
          selector.height = options.search.props.height;
        }
        if (options.search.props.country) {
          selector.country = options.search.props.country;
        }
        if (options.search.props.state) {
          selector.state = options.search.props.state;
        }
        if (options.search.props.city) {
          selector.city = options.search.props.city;
        }

        return selector;
    }
  }),
});



export const ProjectIndex = new Index({
    collection: Project,
    fields: ['project_title', 'project_desc', 'project_genre', 'project_type'],
    
    engine: new MongoDBEngine({
      selector: function (searchObject, options, aggregation) {
      const selector = this.defaultConfiguration().selector(searchObject, options, aggregation)

        if (options.search.props.project_type) {
          selector.project_type = options.search.props.project_type;
        }
        if (options.search.props.project_genre) {
          selector.project_genre = options.search.props.project_genre;
        }

        return selector;
      }
    }),
});

export const IndustryIndex = new Index({
    collection: Industry,
    fields: ['company_name', 'company_desc', 'company_type', 'company_year'],
    
    engine: new MongoDBEngine({
      selector: function (searchObject, options, aggregation) {
      const selector = this.defaultConfiguration().selector(searchObject, options, aggregation)

        if (options.search.props.company_type) {
          selector.company_type = options.search.props.company_type;
        }
        if (options.search.props.company_year) {
          selector.company_year = options.search.props.company_year;
        }
        return selector;
      }
    }),
});

Meteor.publish("allProjects", function(){
  return Project.find({},{
    fields: {
      '_id':1,
      'projectPictureID':1
    }
  });
});

Meteor.publish("otherUsers", function () {
  return Meteor.users.find({},{ 
    fields: { 
      '_id': 1 , 
      'profile': 1, 
      'artistic': 1,
      'emails' : 1, 
      'city':1, 
      'state':1,
      'country':1, 
      'likes':1, 
      'views':1, 
      'resume':1,
      'webpage':1,
      'facebook':1,
      'twitter':1,
      'imdb': 1,
      'youtube':1,
      'vimeo':1,
      'instagram':1,
      'follows' : 1,
      'fullname':1,
      'profilePictureID': 1,
      'profileCoverID': 1,
      'wizard' : 1,
      'likesProject' : 1,
      'media' : 1,
      'showArtisticName': 1,
      'height' : 1,
      'ageRange' : 1,
      'physical': 1,
      'ethnicity': 1,
      'eyes': 1,
      'hair': 1,
      'hairType': 1,
      'languages': 1,
      'beard': 1,
      'peculiarities': 1,
      'skills': 1,
      'profileType': 1,
      'categories': 1,
      'sex': 1,
      'isCrew': 1,
      'isCast': 1
    }
  });
});

Meteor.publish("follows", function (userId) {
   var cuantos = Meteor.users.find({'_id' : userId} , { fields: {'_id': 1 , 'profile': 1}});
   return cuantos;
});

Meteor.publish('myProjects', function(userId) {
   return Project.find();
});

Meteor.publish('myIndustries', function(userId) {
   return Industry.find();
});

Meteor.publish('projectData', function(projId){
   return Project.find();
});

Meteor.publish('params', function(){
   return Params.find();
});

Meteor.publish('myMainProject', function(userId) {
   return Project.find({'userId' : userId, 'project_is_main' : 'true'});
});

Meteor.publish('myPortlets', function() {
   return Portlet.find({},{
    fields: {
      '_id':1,
      'projectID':1,
      'type':1,
      'title':1,
      'content':1,
      'author':1,
      'url':1,
      'order':1,
      'version':1
    }
  });
});


Meteor.publish('allMedia', function(){
  //return Media.find();
  
  return Media.find({},{
    fields: {
      '_id':1,
      'userId':1,
      'mediaId':1,
      'media_title':1,
      'media_desc':1,
      'media_size':1,
      'media_type':1,
      'media_name':1,
      'media_date':1,
      'media_width':1,
      'media_height':1,
      'media_version':1,
      'media_url':1,
      'media_use':1
    }
  });
});

Meteor.publish('getCategories', function() {
   return Ocupation.find();
});

Meteor.publish('getOcupations', function(title) {
   return Ocupation.find();
});

Meteor.publish('getCountries', function() {
   return City.find();
});

Meteor.users.allow({
  update: function () {
    return true;
  }
});  
