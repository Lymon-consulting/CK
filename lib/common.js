import { Index, MongoDBEngine } from 'meteor/easy:search'
import { Project } from '/imports/api/project.js';
// On Client and Server
//const Project = new Mongo.Collection('players')

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

/*
Images = new FS.Collection("images", {
   filter: {
       maxSize: 5 * 1024 * 1024, //in bytes
       allow: {
         contentTypes: ['image/*']
       },
       onInvalid: function (message) {
         if (Meteor.isClient) {
           alert(message);
         } else {
           console.log(message);
         }
       }
    },
    stores: [
      new FS.Store.FileSystem("images"), // , {path: "C:\\workspace\\cinekomuna\\ck_v0.1\\public\\uploads\\"}
      new FS.Store.FileSystem("thumbs", {
        beforeWrite: function(fileObj) {
          // We return an object, which will change the
          // filename extension and type for this store only.
          return {
            extension: 'png',
            type: 'image/png'
          };
        },
        transformWrite: function(fileObj, readStream, writeStream) {
            // Transform the image into a 40x40px PNG thumbnail
            var size = "40";
            gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
          // The new file size will be automatically detected and set for this store
        }
      }),
      new FS.Store.FileSystem("profile", {
        beforeWrite: function(fileObj) {
          // We return an object, which will change the
          // filename extension and type for this store only.
          return {
            extension: 'png',
            type: 'image/png'
          };
        },
        transformWrite: function(fileObj, readStream, writeStream) {
            // Transform the image into a 40x40px PNG thumbnail
            var size = "100";
            gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
          // The new file size will be automatically detected and set for this store
        }
      })
    ]
});

Cover = new FS.Collection("cover", {
   filter: {
       maxSize: 5 * 1024 * 1024, //in bytes
       allow: {
         contentTypes: ['image/*']
       },
       onInvalid: function (message) {
         if (Meteor.isClient) {
           alert(message);
         } else {
           console.log(message);
         }
       }
    },
    stores: [
      new FS.Store.FileSystem("cover"), // , {path: "C:\\workspace\\cinekomuna\\ck_v0.1\\public\\uploads\\"}
      new FS.Store.FileSystem("cover_min", {
        beforeWrite: function(fileObj) {
          // We return an object, which will change the
          // filename extension and type for this store only.
          return {
            extension: 'png',
            type: 'image/png'
          };
        },
        transformWrite: function(fileObj, readStream, writeStream) {
            // Transform the image into a 40x40px PNG thumbnail
            var size = "100";
            gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
          // The new file size will be automatically detected and set for this store
        }
      })
    ]
});

PersonalCover = new FS.Collection("personalcover", {
   filter: {
       maxSize: 5 * 1024 * 1024, //in bytes
       allow: {
         contentTypes: ['image/*']
       },
       onInvalid: function (message) {
         if (Meteor.isClient) {
           alert(message);
         } else {
           console.log(message);
         }
       }
    },
    stores: [
      new FS.Store.FileSystem("personalcover"), // , {path: "C:\\workspace\\cinekomuna\\ck_v0.1\\public\\uploads\\"}
      new FS.Store.FileSystem("personalcover_min", {
        beforeWrite: function(fileObj) {
          // We return an object, which will change the
          // filename extension and type for this store only.
          return {
            extension: 'png',
            type: 'image/png'
          };
        },
        transformWrite: function(fileObj, readStream, writeStream) {
            // Transform the image into a 40x40px PNG thumbnail
            var size = "100";
            //gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
          // The new file size will be automatically detected and set for this store
        }
      })
    ]
});*/