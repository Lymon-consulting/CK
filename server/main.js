import { Meteor } from 'meteor/meteor';
import { Project } from '../imports/api/project.js';
import { Portlet } from '../imports/api/portlet.js';
import { Ocupation } from '../imports/api/ocupations.js';

import '../imports/api/ocupations.js';
import '../imports/startup/server/on-create-user.js';
import './projectMethods.js';
import './userMethods.js';


Meteor.startup(() => {
  process.env.MAIL_URL ="smtp://ljimenez%40lymon.com.mx:ico2000a_B@mail.lymon.com.mx:587?tls.rejectUnauthorized=false";

  Meteor.users._ensureIndex({
      "fullname": 1
    });
});

Meteor.publish("otherUsers", function () {
  return Meteor.users.find({},{ fields: { '_id': 1 , 'profile': 1, 'emails' : 1}});
  //return Meteor.users.find();
});

Meteor.publish("follows", function (userId) {
   var cuantos = Meteor.users.find({'_id' : userId} , { fields: {'_id': 1 , 'profile': 1}});
   return cuantos;
});

Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('cover', function() {
  return Cover.find();
});

Meteor.publish('personalcover', function() {
  return PersonalCover.find();
});

Meteor.publish('myProjects', function(userId) {
   //
   //return Project.find({'userId' : userId, 'project_is_main' : ''});
   //return Project.find({$and : [ {'userId' : userId} , {"project_is_main": '' }]});
   return Project.find();
});

Meteor.publish('projectData', function(projId){
   return Project.find();
});

Meteor.publish('myMainProject', function(userId) {
   return Project.find({'userId' : userId, 'project_is_main' : 'true'});
});

Meteor.publish('myPortlets', function() {
   return Portlet.find();
});

Meteor.publish('getCategories', function() {
   return Ocupation.find();
});

Meteor.publish('getOcupations', function(title) {
   return Ocupation.find('title':title);
});

Meteor.users.allow({
    update: function () {
           return true;
    }
});



/*Meteor.publish('projects', function (dataQuery) {
   console.log("Recibiendo en el dataQuery="+dataQuery);
  return Project.find(dataQuery);
});*/

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
      new FS.Store.FileSystem("images"), //,{path: "C:\\workspace\\cinekomuna\\ck_v0.1\\public\\uploads\\"}
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
    ],
    
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
            var size = "40";
            //gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
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
});