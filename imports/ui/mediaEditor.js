import { Template } from 'meteor/templating';

import './mediaEditor.html';

var uploadingPhotos = ReactiveVar(); // upload indicator


function uploadFiles(files, profileId) {
  _.each(files, function(file) {

    if (!file.type.match(/^image\//)) {
      // message..
      return;
    }
    // some size check
    if (file.size > 1200000) {
      Bert.alert({message: 'El archivo' + file.name +' excede los 12 MB' , type: 'danger', icon: 'fa fa-danger'});
      return;
    }
    // uploading..
    
    var fr = new FileReader;
    fr.onload = function() { // file is loaded
	    var img = new Image;

	    img.onload = function() {
	        console.log(img.width + " x " + img.height); // image is loaded; sizes are available
	    };

	};

    $.cloudinary.config({
      cloud_name:"drhowtsxb"
    });

    var options = {
      folder: Meteor.userId()
    };

    Cloudinary.upload(file, options, function(err,res){
      if(!err){

      	console.log(res);

      	//var newData = userData.obj.width;
      	//var obj = JSON.parse(res);
      	console.log("width="+res.width);
      	console.log("height="+res.height);

        Meteor.call(
          'saveMedia',
          Meteor.userId(),
          res.public_id,
          file.size,
          file.type,
          file.name,
          res.width,
          res.height
        );
        Bert.alert({message: 'Tu archivo ha sido cargado' , type: 'success', icon: 'fa fa-check'});
      }
      else{
        console.log("Upload Error:"  + err); //no output on console
      }
    });
    /*
    var reader = new FileReader();
    reader.onload = function(fileLoadEvent) {
      uploadingPhotos.set((uploadingPhotos.get() || 0) +1);
      Meteor.call('portfolio-upload', profileId, file.type, file.name, reader.result,
                  function(err) {
                    uploadingPhotos.set(uploadingPhotos.get()-1);
                    if (err) {
                      // message..
                    }
                  });
    };*/
    //reader.readAsBinaryString(file);
  });
}

Template.header.rendered = function(){
	$("#dragzone").css({
	  display: "none",
	});
};

Template.dragZone.helpers({
	uploading: function() { 
		return uploadingPhotos.get(); 
	},
  	moreThanOne: function() { 
  		return uploadingPhotos.get() > 1 ? true : false; 
  	}
});

Template.dragZone.events({
  
  'dragover #dropzone': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    t.$('#dropzone').addClass('drag-over');
  },
  'dragleave #dropzone': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    t.$('#dropzone').removeClass('drag-over');
  },
  'dragenter #dropzone': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
  },
  'drop #dropzone': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    uploadFiles(e.originalEvent.dataTransfer.files, this._id);
    t.$('#dropzone').removeClass('drag-over');
    
    $("#dragzone").css({
	  display: "none",
	});
  },        
  'change [type="file"]': function(e, t) {
    uploadFiles(e.target.files, this._id);
    
    $("#dragzone").css({
	  display: "none",
	});
  },
});


Template.mediaEditor.helpers({
	getMedia() {

		 Meteor.subscribe("otherUsers");
	     var user = Meteor.users.findOne({'_id' : Meteor.userId()});

	     if(user && Array.isArray(user.media)){
	       var array = user.media;
	       
	       var sortedJsObjects = array.sort(function(a,b){ 
			    //return Math.abs(new Date(a.media_date) - new Date(b.media_date)) 
			    if (a.media_date > b.media_date) return -1;
   				if (a.media_date < b.media_date) return 1;
			});
	       return sortedJsObjects;
	     }
	     else{
	       return [];
	     }


         
      },
      getURL(mediaId){
      	var url = "";
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/" + mediaId;
        return url;
      },
      formatDate(date){
      	var d = new Date(date);
      	var month = d.toLocaleString('default', { month: 'long' });
		var datestring = d.getDate()  + " " + month + " " + d.getFullYear();

      	return datestring;

      },
      formatSize(size){
      	if(size>0){
      		var i = Math.floor( Math.log(size) / Math.log(1024) );
    		return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    	}
    	else{
    		return 0;
    	}
      }

});

Template.mediaEditor.events({
	
	'click #toggleDropper':function(event, template){
		event.preventDefault();

		if($("#dragzone").is(":visible")){
			$("#dragzone").hide();
		}
		else{
			$("#dragzone").show();	
		}

		
	},
	'drop #toggleDropper': function(event,template){
		event.preventDefault();
		console.log("dropped", files);
        var reader = new FileReader();
        var name = files[0].name;
        var data = event.target.result;
        reader.readAsBinaryString(files[0]);

	},
	'change [type="text"]': function(event,template){
		var id = event.target.id;

		if(id.indexOf("title")>=0){ //es el título
			id = id.substring(id.indexOf("title")+5,id.length);
			$("#message").html("Guardando...");
			Meteor.call(
	        	'updateMediaTitle',
	        	Meteor.userId(),
	        	id,
	        	event.target.value
	        );	
		}
		else if(id.indexOf("descr")>=0){ //es la descripción
			id = id.substring(id.indexOf("descr")+5,id.length);
			$("#message").html("Guardando...");
			Meteor.call(
	        	'updateMediaDescription',
	        	Meteor.userId(),
	        	id,
	        	event.target.value
	        );
		}

		$("#message").html("Datos actualizados");	
	},
	'click .delete' : function(event,template){

		if(confirm("¿Desea eliminar esta imagen?")){
			var public_id = $(event.currentTarget).attr("data-id");
            Cloudinary.delete(public_id,function(res){
               //console.log(res);
            });
            Meteor.call(
              'deleteMedia',
              Meteor.userId(),
              public_id
            );
            
            $('.modal').modal('hide'); 
			$('.modal-backdrop').remove();
		}
	}

});