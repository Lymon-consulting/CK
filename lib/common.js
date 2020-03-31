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

        if (options.search.props.city) {
          selector.city = options.search.props.city;
        }
        if (options.search.props.role) {
          selector.role = options.search.props.role;
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

export let foo = "somedata";