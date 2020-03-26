import { Media } from '../imports/api/media.js';

Meteor.methods({
	saveMedia(userId, fileId, size, type, name, width, height, version, url){

		var date = new Date(Date.now());


		return Media.insert({
		  "userId": userId,
          "mediaId" : fileId,
	      "media_title": "",
	      "media_desc": "",
	      "media_size": size,
	      "media_type": type,
	      "media_name": name,
	      "media_date": date,
	      "media_width": width,
	      "media_height": height,
	      "media_version": version,
	      "media_url" : url
         }, function(error,result){
            //console.log("desde el server el id es "+result);
            return result;
         });
	},
	updateMediaTitle(userId, mediaId, title){
		Media.update(
	       {'userId': userId, 'mediaId': mediaId},
	       { $set: { 'media_title': title }
	     });
	},
	updateMediaDescription(userId, mediaId, description){
		Media.update(
	       {'userId': userId, 'mediaId': mediaId},
	       { $set: { 'media_desc': description }
	     });
	},
	updateMetaData(userId, mediaId, size, width, height, version, url, use){
		var date = new Date(Date.now());
		Media.update(
	       {'userId': userId, 'mediaId': mediaId},
	       { $set: { 'media_size': size, 'media_width':width, 'media_height': height, 'media_date':date, 'media_version':version, 'media_url': url, 'media_use': use }
	     });
	},
	deleteMedia(userId, mediaId){
		Media.remove(
			{'userId': userId, 'mediaId': mediaId}
		);
	}
});