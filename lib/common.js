import { Index, MongoDBEngine } from 'meteor/easy:search'
import { Project } from '/imports/api/project.js';
import { Industry } from '/imports/api/industry.js';
import { Accounts } from 'meteor/accounts-base'
// On Client and Server

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
        if (options.search.props.isCrew) {
          selector.isCrew = options.search.props.isCrew;
        }
        if (options.search.props.isCast) {
          selector.isCast = options.search.props.isCast;
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
