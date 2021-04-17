import { Media } from '../imports/api/media.js';

Meteor.methods({
	saveMedia(entityType, ID, fileId, size, type, name, width, height, version, url){

		var date = new Date(Date.now());

		if(entityType==1){// people
			return Media.insert({
			  "userId": ID,
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
	            return result;
	         });
		}
		else if(entityType==2){// company
			return Media.insert({
			  "companyId": ID,
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
	            return result;
	         });
		}
		else if(entityType==3){// project
			return Media.insert({
			  "projectId": ID,
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
	            return result;
	         });
		}

		
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
	updateMetaData(entityType,ID, mediaId, size, width, height, version, url, use){
		var date = new Date(Date.now());
		if(entityType==1){
			Media.update(
		       {'userId': ID, 'mediaId': mediaId},
		       { $set: { 'media_size': size, 'media_width':width, 'media_height': height, 'media_date':date, 'media_version':version, 'media_url': url, 'media_use': use }
		     });
		}
		else if(entityType==2){
			Media.update(
		       {'companyId': ID, 'mediaId': mediaId},
		       { $set: { 'media_size': size, 'media_width':width, 'media_height': height, 'media_date':date, 'media_version':version, 'media_url': url, 'media_use': use }
		     });
		}
		else if(entityType==3){
			Media.update(
		       {'projectId': ID, 'mediaId': mediaId},
		       { $set: { 'media_size': size, 'media_width':width, 'media_height': height, 'media_date':date, 'media_version':version, 'media_url': url, 'media_use': use }
		     });
		}
		
	},
	deleteMedia(entityType, ID, mediaId){
		if(entityType==1){
			Media.remove(
				{'userId': ID, 'mediaId': mediaId}
			);
		}
		else if(entityType==2){
			Media.remove(
				{'companyId': ID, 'mediaId': mediaId}
			);
		}
		else if(entityType==3){
			Media.remove(
				{'projectId': ID, 'mediaId': mediaId}
			);	
		}
		
	}
});