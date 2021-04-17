import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Industry } from '../api/industry.js';
import { Portlet } from '../api/portlet.js';
import { Ocupation } from '../api/ocupations.js';
import { Media } from '../api/media.js';
import { uploadFiles } from '/lib/functions.js';

import './projectPage.html';
import '/lib/common.js';

Template.projectPage.rendered = function(){
  this.autorun(function(){
    window.scrollTo(0,0);
  });

}

if (Meteor.isClient) {
   Meteor.subscribe('projectData');
   Meteor.subscribe('allProjects');
   Meteor.subscribe('otherUsers');
   Meteor.subscribe("images");
   Meteor.subscribe("myPortlets");
   Meteor.subscribe("userData");

   Template.projectPage.helpers({
      projData(){
         var project = Project.findOne({'_id': FlowRouter.getParam('id')});
         if(project!=null){
           if(!project.likes){
            project.likes = 0;
           }
           if(!project.views){
            project.views = 0;
           }
         }
         return project;
      },
      getMetadata(projectID){
        var project = Project.findOne({'_id': FlowRouter.getParam('id')});
        var metadata = "";
        if(project!=null){
          if(project.project_type!=null && project.project_type!=""){
            metadata = project.project_type + " | ";
          }
          if(project.project_genre!=null && project.project_genre!=""){
            metadata = metadata + project.project_genre + " | ";
          }
          if(project.project_year!=null && project.project_year!=""){
            metadata = metadata + project.project_year;
          }

          if(metadata.substring(metadata.length-3, metadata.length)===" | "){
            metadata = metadata.substring(0,metadata.length-3);
          }
        }
        return metadata;
      },
      getProjectRoles(){
        var prole;
        var strResult="";
        var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
        userRoles = data.project_role;

        console.log(userRoles);

        for (var i = 0; i < userRoles.length; i++) {
          strResult = strResult + ", " + userRoles[i];
        }
        strResult = strResult.substring(2, strResult.length);
        return strResult;
      },
      getProjectPicture(size) {
        Meteor.subscribe("allMedia");
        var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
        var url;
        if(data!=null && data.projectPictureID!=null){
          var cover = Media.findOne({'mediaId':data.projectPictureID});
          if(cover!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_fill" + "/v" + cover.media_version + "/" + data.userId + "/" + data.projectPictureID;    
          }
          
        }
        return url;
        /*
          var url = "";
          var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
          if(data!=null && data.projectPictureID!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.projectPictureID;
          }
         return url;*/
      },
      getStatus(status){
        if(status==="Terminado"){
          return "";
        }
        else{
          return "En "+status;
        }
      },
      getWeb(){
        var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
        var web = "";
        if(data.project_web_page!=null && data.project_web_page!=""){
          web = " | <a href='"+ data.project_web_page +"' class='black-link'>" +data.project_web_page +"</>" ;
        }
        return web      
      },
      getProjectPoster() {
        Meteor.subscribe("allMedia");
        var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
        var url;
        if(data!=null && data.projectPosterID!=null){
          var cover = Media.findOne({'mediaId':data.projectPosterID});
          if(cover!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + cover.media_version + "/" + data.userId + "/" + data.projectPosterID;    
          }
          
        }
        return url;
      },
      isOwner(){
        project = Project.findOne({'_id': FlowRouter.getParam('id')});
        if(project!=null && project.userId === Meteor.userId()) {
           val = true;
        }
        else{
           val = false;
        }
        return val;
      },
      statusPublished(){
        return Project.findOne({'_id': FlowRouter.getParam('id')}).status;
      },
      statusPublishedOrIsOwner(){
        var project = Project.findOne({'_id': FlowRouter.getParam('id')});
        var status = false;
        var isOwner = false;
        if(project!=null) {
          status = project.status;  
          if(project.userId === Meteor.userId()) {
            isOwner = true;
          }  
        }
        
        if(isOwner || status){
          return true;
        }
        else{
          return false;
        }
        
      },
      
      ownerName(owner){
        var name = "";
        var user = Meteor.users.findOne({'_id':owner});
        if(user){
          if(user.profile.name!=null && user.profile.name!=""){
            name = user.profile.name;  
          }
          if(user.profile.lastname!=null && user.profile.lastname!=""){
            name = name + " " + user.profile.lastname;
          }
          if(user.profile.lastname2!=null && user.profile.lastname2!=""){
            name = name + " " + user.profile.lastname2;
          }
        }
        return name;
      },
      ownerRole(owner){
         var u = Meteor.users.findOne({'_id': owner});
         var result = "";
         if(u){
            rolesArray = u.role;
            if(rolesArray){
               var size = rolesArray.length;
               var count = 0;
               rolesArray.forEach(function(elem){
                  result = result + elem;
                  count++;
                  if(count < size){
                     result = result + ", ";
                  }
               });
            }
         }
         return result;
      },
      wizard(){
        var wizard = false;
        if(Meteor.user()){
          if(Meteor.user().wizard){
            wizard = Meteor.user().wizard;
          }
       }
       return wizard;
     },
     isCollaborator(){

        var result = false;
        var array = new Array();

        var project = Project.findOne({'_id': FlowRouter.getParam('id')});
        if(project!=null && project.userId === Meteor.userId()) {
           result = true;
        }

        if(!result){
          if(project!=null){
            var staff = project.project_staff;
            if(staff!=null && staff!=""){
              for (var i = staff.length - 1; i >= 0; i--) {
                if(staff[i]._id === Meteor.userId()){
                  result=true;
                  break;
                }
              }
            }
          }  
        }
        return result;
     },
      profilePicture(userId){
         return Images.find({'owner': userId});
      },
      ownerEmail(owner){
         var u = Meteor.users.findOne({'_id': owner});
         var email = "";
         if(u){
            u.emails.forEach(function(element) {
              if(element.address != ""){ 
                  email=element.address;
              }
            });
         }
         return email;
      },
      getAllOcupations(){
        return Ocupation.find({},{sort:{"secondary":1}}).fetch();
     },
      settings: function() {
       return {
         position: "bottom",
         limit: 20,
         rules: [
           {
             //token: '',
             collection: Meteor.users,
             field: "fullname",
             template: Template.userPill,
             noMatchTemplate: Template.noMatch
           }
         ]
       };
     },
     getProfilePicture(userId) {
      Meteor.subscribe("allMedia");
      var user = Meteor.users.findOne({'_id':userId});
      var url;
      if(user!=null && user.crew.profilePictureID!=null){
        var profile = Media.findOne({'mediaId':user.crew.profilePictureID});
        if(profile!=null){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_100,h_100,c_thumb,r_max" + "/v" + profile.media_version + "/" + userId + "/" + user.crew.profilePictureID;    
        }
        
      }
      return url;
      /*
         var url = "";
         var user = Meteor.users.findOne({'_id':userId});
         if(user!=null && user.profilePictureID!=null && user.profilePictureID!=""){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_100,h_100,c_thumb,r_max/" + user.profilePictureID;
         }
         return url;*/

      },
      getInitials(userId){
        var name = "";
        var lastname = "";
        var initials = "";      
        var user = Meteor.users.findOne({'_id':userId});
        if(user){
          name = user.profile.name;
          lastname = user.profile.lastname;
          initials = name.charAt(0) + lastname.charAt(0);  
        }
        return initials;
      },
      contentCount(){
        var idPortlet = $("#idPortlet").val();
        var portlet = Portlet.findOne({'_id': idPortlet});
        if(portlet){
          var rest = portlet.content;
          var result = 0;
          if(rest!=null && rest.length!=null){
            result = (450 - rest.length);
          }
          return result;
         }
         else{
          return 450;
         }
      },
      showCounter(){
        if(Session.get("modalType")!= null && Session.get("modalType")==="text"){
          return true;
        }
        else{
          return false;
        }

      },
      modalType(){
        return Session.get("modalType");
      },
      notLikeThisProject(){
        Meteor.subscribe('otherUsers');
        var projectsUserLike = Meteor.users.find({$and : [ {'_id' : Meteor.userId()} , {"likesProject":  FlowRouter.getParam('id')}]});

        var found = true;
        if(projectsUserLike.count() > 0){
           found = false;
        }
        return found;
      },
      getMedia() {
        Meteor.subscribe("allMedia");
        var media = Media.find({'userId': Meteor.userId()});
        return media;
      },
      getGallery(){
        var data = Project.findOne({'_id' : FlowRouter.getParam('id')});
        var array = new Array();
        
        if(data){
          if(data.gallery){
            for (var i = 0; i < data.gallery.length; i++) {
              var obj = {};
              obj.mediaId = data.gallery[i];

              if(i==0){
                obj.position = 1;
              }
              else{
                obj.position = 2;
              }
               array.push(obj);
              
            }
          }
        }
        return array;
      },
      isFirstElement(position){
        var result = false;
        if(position==1){
          result = true;
        }
        else{
          result = false;
        }
        return result;
      },
      getURL(mediaId){
        var url = "";
        var media = Media.findOne({'mediaId':mediaId});
          if(media!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + media.media_version + "/" + media.userId + "/" + media.mediaId;    
          }
        return url;
      },
      hasMedia() {
        Meteor.subscribe("allMedia");
        //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
        var media = Media.find({'userId': Meteor.userId()}).count();
        var hasMedia = false;
        if(media > 0){
          hasMedia = true;
        }
        return hasMedia;
      },
      getMedia() {
        Meteor.subscribe("allMedia");
        //var media = Media.find({'userId': Meteor.userId(), 'media_use': type});
        var media = Media.find({'userId': Meteor.userId()},{sort:{'media_date':-1}});
        return media;
      },

   });

  Template.projectPage.events({
    'click #goBackTop': function(event){
      window.scrollTo(0,0);
    }
  });

   Template.items.helpers({
      items() {
        Meteor.subscribe("myPortlets");
        var portlets = Portlet.find({'projectID': FlowRouter.getParam('id')}, {sort: {'order': 1}}).fetch(); //Portlet.find({'projectID': FlowRouter.getParam('id')}).fetch();
        return portlets;
      },
      isOwner(){
        project = Project.findOne({'_id': FlowRouter.getParam('id')});
        if(project!=null && project.userId === Meteor.userId()) {
           val = true;
        }
        else{
           val = false;
        }
        return val;
      },
      isNotTheFirst(order){
        if(order>1){
          return  true;
        }
        else{
          return false;
        }
      },
      isNotTheLast(order){
        var portlets = Portlet.find({'projectID': FlowRouter.getParam('id')}, {sort: {'order': 1}}).fetch();
        if(portlets!=null && order<portlets.length){
          return  true;
        }
        else{
          return false;
        }
      },

    });

   Template.items.events({
      'click #up': function(event){
        event.preventDefault();
        var id = $(event.target).data('id');
        var portlet = Portlet.findOne({'_id':id});
        if(portlet!=null){
          var order = portlet.order;
          order = order - 1;
          var upperPortlet = Portlet.findOne({$and:[{'projectID': FlowRouter.getParam('id')},{'order':order}]});
          if(upperPortlet!=null){
            //console.log("Ya hay otro portlet con ese orden y es "+upperPortlet._id);
            portlet.order = upperPortlet.order;
            Meteor.call('updatePortletOrder',portlet);  
            upperPortlet.order = portlet.order + 1;
            Meteor.call('updatePortletOrder',upperPortlet);  
          }
        }
      },
        'click #down': function(event){
        event.preventDefault();
        var id = $(event.target).data('id');
        var portlet = Portlet.findOne({'_id':id});
        if(portlet!=null){
          var order = portlet.order;
          order = order + 1;
          var downPortlet = Portlet.findOne({$and:[{'projectID': FlowRouter.getParam('id')},{'order':order}]});
          if(downPortlet!=null){
            //console.log("Ya hay otro portlet con ese orden y es "+downPortlet._id);
            portlet.order = downPortlet.order;
            Meteor.call('updatePortletOrder',portlet);  
            downPortlet.order = portlet.order - 1;
            Meteor.call('updatePortletOrder',downPortlet);  
          } 
          
        }
      },
      'click #edit_portlet' : function(e, template, doc){
          e.preventDefault();
          //console.log("Aquí dentro");

          var id = $(e.target).attr('data-id');
          //console.log(id);
          var mode = $(e.target).attr('mode');
          //console.log(mode);
          var portlet = Portlet.findOne({"_id":id});

          //console.log(portlet);
          var type = portlet.type;
          var title = portlet.title;
          var url = portlet.url;

          if(type==='text'){
            Session.set("modalType","text");
            $('#modePortlet').val(mode);
            $('#idPortlet').val(id);
            $('#title').val(portlet.title);
            $('#content').val(portlet.content);
            $('#modalPortletText').show();
            window.scrollTo(0, 0);
          }
          else if(type==='image'){
            Session.set("modalType","image");
            $('#modePortletImg').val(mode);
            $('#idPortletImg').val(id);
            $('#titleImg').val(portlet.title);
            $('#descImg').val(portlet.content);
            $('#maxImg').text(450-portlet.content.length);
            $('#urlImg').val(portlet.url);
            $('#version').val(portlet.author);
            $('#imageModal').show();
            window.scrollTo(0, 0);
          }
          else if(type==='video'){
            Session.set("modalType","video");
            $('#modePortletVid').val(mode);
            $('#idPortletVid').val(id);
            $('#titleVid').val(portlet.title);
            $('#urlVid').val(portlet.url);
            $('#descVid').val(portlet.content);
            $('#maxVid').text(450-portlet.content.length);
            $('#videoModal').show();
            window.scrollTo(0, 0);
          }
          else if(type==='quote'){
            Session.set("modalType","quote");
            $('#modePortletQuote').val(mode);
            $('#idPortletQuote').val(id);
            /*$('#titleQuote').val(portlet.title);*/
            $('#quote').val(portlet.content);
            $('#maxQuote').text(450-portlet.content.length);
            $('#quoteModal').show();
            window.scrollTo(0, 0);
          }
          else if(type==='link'){
            Session.set("modalType","link");
            $('#modePortletLink').val(mode);
            $('#idPortletLink').val(id);
            /*$('#titleVid').val(portlet.title);*/
            $('#urlLink').val(portlet.url);
            $('#contentLink').val(portlet.content);
            $('#linkModal').show();
            window.scrollTo(0, 0);
          }
        },
      'click #delete_portlet' : function(e, template, doc){
          e.preventDefault();
          if(confirm("¿Deseas eliminar esta sección?")){
            var id = $(e.target).attr('data-id');
            var url = $(e.target).attr('data-url');
            var mode = $(e.target).attr('mode');
            if(mode==='delete'){
              
              Meteor.call(
                'deletePortlet',
                id, function(error,result){
                  if(!error){
                    Cloudinary.delete(url,function(res){
                      //console.log(res);
                    });
                  }
                }
              );

              //Reordenamiento de índices
              var portlets = Portlet.find({'projectID': FlowRouter.getParam('id')}, {sort: {'order': 1}}).fetch();

              if(portlets!=null && portlets.length>0){
                for(var i=1; (i-1) < portlets.length; i++){
                  var portlet = portlets[i-1];
                  portlet.order = i;
                  Meteor.call('updatePortletOrder',portlet);
                }
              }
            }

          }
          
          
        }
   });

   Template.portlet.helpers({
      isOwner(){
        project = Project.findOne({'_id': FlowRouter.getParam('id')});
        if(project!=null && project.userId === Meteor.userId()) {
           val = true;
        }
        else{
           val = false;
        }
        return val;
      },
      isText(type){
        if(type==="text"){
          return true;
        }
        else{
          return false;
        }
      },
      isImage(type){
        if(type==="image"){
          return true;
        }
        else{
          return false;
        }
      },
      isVideo(type){
        if(type==="video"){
          return true;
        }
        else{
          return false;
        }
      },
      isQuote(type){
        if(type==="quote"){
          return true;
        }
        else{
          return false;
        }
      },
      isLink(type){
        if(type==="link"){
          return true;
        }
        else{
          return false;
        }
      },
      cloudURL(){
        return Meteor.settings.public.CLOUDINARY_RES_URL;
      }
   });

   Template.projectPage.events({
      'click #pushLike': function(event, template) {
         event.preventDefault();
         var currentLikes = 1; 
         var proj = Project.findOne({'_id' : FlowRouter.getParam('id')});
         if(proj.likes){
            currentLikes = proj.likes;
            currentLikes++;
         }
         Project.update(
            {'_id': FlowRouter.getParam('id')},
            { $set: { 'likes': currentLikes } }
         );
         Meteor.call(
          'addLikesProject',
          Meteor.userId(),
          FlowRouter.getParam('id')
          );
      }, 

      'click #pushDontLike' : function(event, template){
        event.preventDefault();
        var currentLikes = 1; 
        var proj = Project.findOne({'_id' : FlowRouter.getParam('id')});
        if(proj.likes){
           currentLikes = proj.likes;
           currentLikes--;
        }
        Project.update(
           {'_id': FlowRouter.getParam('id')},
           { $set: { 'likes': currentLikes } }
        );

        Meteor.call(
          'removeLikesProject',
          Meteor.userId(),
          FlowRouter.getParam('id')
        );

      },
      
      'dragover #drop-zone'(e, t) {
        e.preventDefault();
      },
      'dragenter #drop-zone'(e, t) {
        e.preventDefault();
      },
      'drop .draggableItem'(e, t) {
        e.preventDefault();
        console.log("drop");
        var id = e.dataTransfer.getData("data-id");
        console.log(id);
      },
      'keyup #content' : function(event){
         event.preventDefault();
         
         var len = $('#content').val().length;
         if(len > 450){
            val.value= val.value.substring(0,450);
         }
         else{
            $('#max').text(450-len);
         }
      },
      'keyup #descImg' : function(event){
         event.preventDefault();
         
         var len = $('#descImg').val().length;
         if(len > 450){
            val.value= val.value.substring(0,450);
         }
         else{
            $('#maxImg').text(450-len);
         }
      },
      'keyup #descVid' : function(event){
         event.preventDefault();
         
         var len = $('#descVid').val().length;
         if(len > 450){
            val.value= val.value.substring(0,450);
         }
         else{
            $('#maxVid').text(450-len);
         }
      },
      'keyup #quote' : function(event){
         event.preventDefault();
         
         var len = $('#quote').val().length;
         if(len > 450){
            val.value= val.value.substring(0,450);
         }
         else{
            $('#maxQuote').text(450-len);
         }
      },
      'click #add_collaborator' : function(e, template, doc){
          e.preventDefault();

          var nombre = $( "#msg").val();
          var oficio = $( "select#oficio option:checked" ).val();
          var id = $("#userId").val();
          var mail = $("#userMail").val();

          //console.log("PorNombre="+ nombre + ", oficio="+oficio + ", id="+id + ", mail="+mail);

          var collaborator = {
            "_id" : id,
            "email": mail,
            "role": oficio,
            "name" : nombre,
            "confirmed": false,
            "invite_sent": false
          };

          exists = Project.find({$and:[{"_id":FlowRouter.getParam('id')},{ project_staff: {$elemMatch:{"email":mail,"role":oficio}}}]});

          console.log("--->"+exists.count()+"<---");
          
          if(exists.count()===0){
             Project.upsert(
               {'_id': FlowRouter.getParam('id')},
               { $push: { project_staff: collaborator }
            });
          }

          
         
          $( "#msg").val("");
          $( "select#oficio option:checked" ).val("Actor");
          $("#userId").val("");
          $("#userMail").val("");

          
        }, 
         'click #add_collaborator_by_mail' : function(e, template, doc){
             e.preventDefault();

             var mail = $( "#addByMail").val();
             var oficio = $( "select#oficioByMail option:checked" ).val();
             
             var idFromTimestamp = "@" + new Date().getTime();

             console.log("oficio="+oficio + ", mail="+mail + ", id="+idFromTimestamp);

             var collaborator = {
               "_id" : idFromTimestamp,
               "email": mail,
               "role": oficio,
               "name" : '',
               "confirmed": false,
               "invite_sent": false
             };

             exists = Project.find({$and:[{"_id":FlowRouter.getParam('id')},{ project_staff: {$elemMatch:{"email":mail,"role":oficio}}}]});

             console.log("--->"+exists.count()+"<---");
             
             if(exists.count()===0){
                if(mail!=""){
                   Project.upsert(
                        {'_id': FlowRouter.getParam('id')},
                        { $push: { project_staff: collaborator }
                   });
                }
             }
            
             $( "#addByMail").val("");
             $( "select#oficioByMail option:checked" ).val("Actor");
             
             $( "#msg").val("");
             $( "select#oficio option:checked" ).val("Actor");
             $("#userId").val("");
             $("#userMail").val("");
             
             $('#inviteByMail').modal('toggle');
             $('#collabModal').modal('show');
             
             
           },
           'click .single-delete' : function(e, template, doc){
             e.preventDefault();

             var id = $(e.target).attr('data-id');
             var name = $(e.target).attr('data-name');
             var mail = $(e.target).attr('data-email');
             var role =  $(e.target).attr('data-role');
             
             console.log("va a borrar="+name + ", " + mail + ", " + role + ", " + id);

             var collaborator = {
               /*"id": id,*/
               "email": mail,
               "role": role,
               "name" : name
             };

             Project.upsert(
                  {'_id': FlowRouter.getParam('id')},
                  { $pull: { project_staff: collaborator }
               });
           },
      
      'autocompleteselect input': function(event, template, doc) {
          console.log("selected ", doc);
          if(doc!=null){
             $( "#userId").val(doc._id);
             $( "#userMail").val(doc.emails[0].address);
          }
          else{
             $( "#userId").val(""); 
          }
        }, 
        'click #sendNotification' : function(){
            if(confirm("Se enviará una notificación a todas las personas de tu lista que aún no la reciben, ¿deseas continuar?")){
               var collabs = null;
               var proj = Project.findOne({'_id': FlowRouter.getParam('id')});
               var sender = Meteor.users.findOne({'_id': Meteor.userId()});
               if(proj){
                  collabs = proj.project_staff;
                  for(var k in collabs){
                     if(!collabs[k].confirmed && !collabs[k].invite_sent){
                        var emailData = {
                          name: collabs[k].name,
                          sender: sender.fullname,
                          sender_id: sender._id,
                          production: proj.project_title,
                          production_id : proj._id,
                          role: collabs[k].role,
                          domain : Meteor.settings.public.domain
                        };
                        Meteor.call(
                          'sendEmail',
                          collabs[k].name + "<" + collabs[k].email + ">",
                          Meteor.settings.public.global_mail_sender,
                          'Has recibido una invitación de '+ sender.fullname +' para ingresar a Cinekomuna',
                          'collaboration-template.html',
                          emailData
                        );
                        collabs[k].invite_sent = true;
                     }
                  }
                  Meteor.call(
                     'updateInvitationStatusForAll',
                     FlowRouter.getParam('id'),
                     collabs,
                     true
                  );

               }
               Bert.alert({message: 'Mensaje enviado', type: 'info'});
            }
        },
           'click .sendIndividualInvite' : function(e, template, doc){
             e.preventDefault();

             var id = $(e.target).attr('data-id');
             var name = $(e.target).attr('data-name');
             var mail = $(e.target).attr('data-email');
             var role =  $(e.target).attr('data-role');
             var sender = Meteor.users.findOne({'_id': Meteor.userId()});
             var proj = Project.findOne({'_id': FlowRouter.getParam('id')});
             if(confirm("Se va enviar un correo a " + mail +", ¿Deseas continuar?")){

                console.log("Reenviando correo...");

                var emailData = {
                  name: name,
                  sender: sender.fullname,
                  sender_id: sender._id,
                  production: proj.project_title,
                  production_id : proj._id,
                  role: role,
                  domain : Meteor.settings.public.domain
                };
                Meteor.call(
                  'sendEmail',
                  name + "<" + mail + ">",
                  Meteor.settings.public.global_mail_sender,
                  'Has recibido una invitación de '+ sender.fullname +' para ingresar a Cinekomuna',
                  'collaboration-template.html',
                  emailData
                );

                Bert.alert({message: 'Se ha enviado un correo a ' + mail, type: 'info'});

                Meteor.call(
                  'updateInvitationStatusForOne',
                  FlowRouter.getParam('id'),
                  id,
                  true
               );
             }
             
           },
        'click #manageModal' : function(){
            $('#addByMail').val( $('#msg').val());
            $('#collabModal').modal('toggle');
            $('#inviteByMail').modal('show');
        }, 
        'click #selectPicture': function(event,template){
         event.preventDefault();
         var mediaId = $(event.currentTarget).attr("data-id");
         
         Session.set("selectedImg",mediaId);

         console.log("Mostrando el div escondido");
         $(".imagesAttr").show();
         $("#imagesGrid").hide();
         
         


         //console.log(mediaId);
        /*
         Meteor.call(
            'updateProfilePicture',
            Meteor.userId(),
            mediaId
          );*/

        //$('.modal').modal('hide'); 
        //$('.modal-backdrop').remove();

      },
        'click #cancel': function(event,template,doc){
            $('#collabModal').modal('toggle');
        },
        'click #search': function(event,template,doc){
            /*$('#collabModal').modal('toggle');
            FlowRouter.go('/searchCollaborator/' + FlowRouter.getParam('id')); */
            $('#collabModal')
              .on('hidden.bs.modal', function() {
                  FlowRouter.go('/searchCollaboratorForProject/' + FlowRouter.getParam('id'));
              })
              .modal('hide');
        },
        'click #searchCast': function(event,template,doc){
            /*$('#collabModal').modal('toggle');
            FlowRouter.go('/searchCollaborator/' + FlowRouter.getParam('id')); */
            $('#collabModal')
              .on('hidden.bs.modal', function() {
                  FlowRouter.go('/searchCastForProject/' + FlowRouter.getParam('id'));
              })
              .modal('hide');
        },
        'click #searchCompany': function(event,template,doc){
            /*$('#collabModal').modal('toggle');
            FlowRouter.go('/searchCollaborator/' + FlowRouter.getParam('id')); */
            $('#collabModal')
              .on('hidden.bs.modal', function() {
                  FlowRouter.go('/searchIndustryForProject/' + FlowRouter.getParam('id'));
              })
              .modal('hide');
        },
        'click .clear_portlet': function(event,template,doc){
            var type = $(event.target).attr('data-type');
            Session.set("showCounter",null);
            //console.log(type);
            $('#title').val("");
            $('#content').val("");
            $('#type').val(type);
            $('#author').val("");
            $('#url').val("");
            $('#version').val("");
            
            if(type==="text"){
              $('#modePortlet').val("add");
              $('#modalPortletText').show();  
            }
            else if(type==="image"){
              $('#modePortletImg').val("add");
              $('#imageModal').show();   
            }
            else if(type==="video"){
              $('#modePortletVid').val("add");
              $('#videoModal').show();   
            }
            else if(type==="quote"){
              $('#modePortletQuote').val("add");
              $('#quoteModal').show();  
            }
            else if(type==="link"){
              $('#modePortletLink').val("add");
              $('#linkModal').show();  
            }
        },
        'click #edit_portlet' : function(e, template, doc){
          e.preventDefault();
          
          var id = $(e.target).attr('data-id');
          var mode = $(e.target).attr('mode');
          var portlet = Portlet.findOne({"_id":id});
          var type = portlet.type;
          var title = portlet.title;
          var url = portlet.url;

          if(type==='text'){
            Session.set("modalType","text");
            $('#modePortlet').val(mode);
            $('#idPortlet').val(id);
            $('#title').val(portlet.title);
            $('#content').val(portlet.content);
            $('#modalPortletText').show();
            window.scrollTo(0, 0);
          }
          else if(type==='image'){
            Session.set("modalType","image");
            $('#modePortletImg').val(mode);
            $('#idPortletImg').val(id);
            $('#titleImg').val(portlet.title);
            $('#descImg').val(portlet.content);
            $('#maxImg').text(450-portlet.content.length);
            $('#urlImg').val(portlet.url);
            $('#version').val(portlet.author);
            $('#imageModal').show();
            window.scrollTo(0, 0);
          }
          else if(type==='video'){
            Session.set("modalType","video");
            $('#modePortletVid').val(mode);
            $('#idPortletVid').val(id);
            $('#titleVid').val(portlet.title);
            $('#urlVid').val(portlet.url);
            $('#descVid').val(portlet.content);
            $('#maxVid').text(450-portlet.content.length);
            $('#videoModal').show();
            window.scrollTo(0, 0);
          }
          else if(type==='quote'){
            Session.set("modalType","quote");
            $('#modePortletQuote').val(mode);
            $('#idPortletQuote').val(id);
            /*$('#titleQuote').val(portlet.title);*/
            $('#quote').val(portlet.content);
            $('#maxQuote').text(450-portlet.content.length);
            $('#quoteModal').show();
            window.scrollTo(0, 0);
          }
          else if(type==='link'){
            Session.set("modalType","link");
            $('#modePortletLink').val(mode);
            $('#idPortletLink').val(id);
            /*$('#titleVid').val(portlet.title);*/
            $('#urlLink').val(portlet.url);
            $('#contentLink').val(portlet.content);
            $('#linkModal').show();
            window.scrollTo(0, 0);
          }
          
          
        },/*
        'click .add_portlet': function(event,template,doc){
            
            var type = $(event.target).attr('data-type');

            Session.set("showCounter",null);
            
            console.log(type);
            
            $('#titlePortlet').val("");
            $('#content').val("");
            $('#idPortlet').val("");
            $('#modePortlet').val("add");
            if(type==="text"){
              Session.set("modalType","text");
              $("#modalTitle").text("TEXTO");
            }
            else if (type==="image"){
              Session.set("modalType","image");
              $("#modalTitle").text("IMAGEN");
              
            }
            $('#textModal').show();
        },*/
        'click #saveTextPortlet' : function(e, template, doc){
          e.preventDefault();
          
          var mode = $( "#modePortlet").val(); //add o edit para agregar o modificar
          var id = $( "#idPortlet").val(); //solo cuando es edición
          var type = "text"; //text, image, video, quote, link
          var title = $("#title").val();
          var content = $('#content').val();
          var author = $('#author').val();//only used for quote type
          var url = $('#url').val();//image, video and link

          /*console.log("Va a guardar: title=" + title+
            ", mode="+mode+
            ", type=" + type + 
            ", title="+title+ 
            ", content="+content+
            ", author="+author+
            ", url="+url);*/

          if(title === ""){
            Bert.alert({message: 'El título no puede estar vacío', type: 'danger', icon: 'fa fa-exclamation'});
          }
          else if(type==="text" && content===""){
            Bert.alert({message: 'El contenido no puede estar vacío', type: 'danger', icon: 'fa fa-exclamation'});
          }
          else if(type==="video" && url===""){
            Bert.alert({message: 'La URL no puede estar vacía', type: 'danger', icon: 'fa fa-exclamation'});
          }
          else{
            if(mode==="edit"){
              Meteor.call(
                 'updatePortlet',
                 id,
                 title,
                 content,
                 author,
                 url
              );
              $( "#modePortlet").val("add");
            }
            else if(mode==="add"){

              var portlet = Portlet.findOne({"projectID" : FlowRouter.getParam('id')},{sort: {'order': -1}});
              var order;
              if(portlet!=null){
                order = portlet.order + 1;
              }
              else{
                order = 1;
              }

              Meteor.call(
                 'insertPortlet',
                 FlowRouter.getParam('id'),
                 type,
                 title,
                 content,
                 author,
                 url,
                 order
              );
          }
          $('#modalPortletText').hide();
        }
      },
      'click #saveImagePortlet' : function(e, template, doc){
          e.preventDefault();
          
          var mode = $( "#modePortletImg").val(); //add o edit para agregar o modificar
          var id = $( "#idPortletImg").val(); //solo cuando es edición
          var type = "image";
          var title = $("#titleImg").val();
          var url = $("#urlImg").val();//contiene el public_id de Cloudinary
          var content = $("#descImg").val();//contiene la descripción de la imagen
          var version = $("#version").val();//contiene la versión de la imagen en cloudinary
          var porID = null;
          /*
          console.log("Va a guardar: title=" + title+
            ", mode="+mode+
            ", type=" + type + 
            ", title="+title+ 
            ", content="+content+
            ", author="+author+
            ", url="+url);*/

          if(title === ""){
            Bert.alert({message: 'El título no puede estar vacío', type: 'danger', icon: 'fa fa-exclamation'});
          }
          else{
            $.cloudinary.config({
              cloud_name: Meteor.settings.public.CLOUD
            });
            if(mode==="edit"){
              //url = url.substring(url.indexOf("portlets")+9, url.length);
              console.log("Actualizando imagen "+url);
              var options = {
                /*folder: Meteor.userId()+"/portlets",*/
                public_id: url
              };
              var file = document.getElementById('portlet-img-upload').files[0];
              Cloudinary.upload(file, options, function(err,res){
                if(!err){
                  Meteor.call(
                     'saveVersion',
                     id,
                     res.version,
                  );
                  Meteor.call(
                     'updatePortlet',
                     id,
                     title,
                     content,
                     null,
                     url
                  );
                }
                else{
                  console.log("Upload Error:"  + err); //no output on console
                }
              });
              
              
              
            }
            else if(mode==="add"){
              var portlet = Portlet.findOne({"projectID" : FlowRouter.getParam('id')},{sort: {'order': -1}});
              var order;
              if(portlet!=null){
                order = portlet.order + 1;
              }
              else{
                order = 1;
              }

              Meteor.call(
                 'insertPortlet',
                 FlowRouter.getParam('id'),
                 type,
                 title,
                 content,
                 null,
                 null,
                 order, function(error, result){
                   if(!error){
                      
                      

                      var options = {
                        folder: Meteor.userId() + "/portlets"
                      };

                      var file = document.getElementById('portlet-img-upload').files[0];

                      Cloudinary.upload(file, options, function(err,res){
                        if(!err){
                          Meteor.call(
                             'savePortletPictureID',
                             result,
                             res.public_id,
                             res.version
                          );
                        }
                        else{
                          console.log("Upload Error:"  + err); //no output on console
                        }
                      });
                   }
                 }
              );
            }
            //$('#modalPortletImage').hide();
            //$("#imageModal").hide();
            $('#imageModal').hide();
            $('#imagesAttr').hide();
            $('#imagesGrid').show();
            $('#imageModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

            Session.set("selectedImg",null);

          }
        },
        'click #saveVideoPortlet' : function(e, template, doc){
          e.preventDefault();
          
          var mode = $( "#modePortletVid").val(); //add o edit para agregar o modificar
          var id = $( "#idPortletVid").val(); //solo cuando es edición
          var type = "video"; //text, image, video, quote, link
          var title = $("#titleVid").val();
          var content = $('#descVid').val();
          var author = $('#authorVid').val();//only used for quote type
          var url = $('#urlVid').val();//only used for image, video and link type
          
          if(url.indexOf("youtube.com/watch?v=")>1){/*Parseo de la URL para extraer el ID del video en youtube*/
            var youtubeVideoID = url.substring(url.indexOf("?v=")+3, url.length);
            url = "https://www.youtube.com/embed/" + youtubeVideoID;
          }
          else if(url.indexOf("//vimeo.com")>1){/*Parseo de la URL para extraer el ID del video en vimeo*/
            var vimeoVideoID = url.substring(url.indexOf(".com/")+5, url.length);
            url = "https://player.vimeo.com/video/" + vimeoVideoID+"?portrait=0";
          }

          if(title === ""){
            Bert.alert({message: 'El título no puede estar vacío', type: 'danger', icon: 'fa fa-exclamation'});
          }
          else if(url===""){
            Bert.alert({message: 'La URL no puede estar vacía', type: 'danger', icon: 'fa fa-exclamation'});
          }
          else{
            if(mode==="edit"){
              Meteor.call(
                 'updatePortlet',
                 id,
                 title,
                 content,
                 author,
                 url
              );
              $( "#modePortletVid").val("add");
            }
            else if(mode==="add"){
              var portlet = Portlet.findOne({"projectID" : FlowRouter.getParam('id')},{sort: {'order': -1}});
              var order;
              if(portlet!=null){
                order = portlet.order + 1;
              }
              else{
                order = 1;
              }

              Meteor.call(
                 'insertPortlet',
                 FlowRouter.getParam('id'),
                 type,
                 title,
                 content,
                 author,
                 url,
                 order
              );
          }
          $('#videoModal').hide();
        }
      },
        'click #saveQuotePortlet' : function(e, template, doc){
          e.preventDefault();
          
          var mode = $( "#modePortletQuote").val(); //add o edit para agregar o modificar
          var id = $( "#idPortletQuote").val(); //solo cuando es edición
          var type = "quote"; //text, image, video, quote, link
          var title = null; // $("#titleQuote").val();
          var content = $('#quote').val();
          var author = $('#authorQuote').val();//only used for quote type
          /*
          if(title === ""){
            Bert.alert({message: 'El título no puede estar vacío', type: 'danger', icon: 'fa fa-exclamation'});
          }*/
          if(content===""){
            Bert.alert({message: 'La Frase no puede estar vacía', type: 'danger', icon: 'fa fa-exclamation'});
          }
          else{
            if(mode==="edit"){
              Meteor.call(
                 'updatePortlet',
                 id,
                 title,
                 content,
                 author,
                 null
              );
              $( "#modePortletQuote").val("add");
            }
            else if(mode==="add"){
              var portlet = Portlet.findOne({"projectID" : FlowRouter.getParam('id')},{sort: {'order': -1}});
              var order;
              if(portlet!=null){
                order = portlet.order + 1;
              }
              else{
                order = 1;
              }
              Meteor.call(
                 'insertPortlet',
                 FlowRouter.getParam('id'),
                 type,
                 title,
                 content,
                 author,
                 null,
                 order
              );
          }
          $('#quoteModal').hide();
        }
      },
        'click #saveLinkPortlet' : function(e, template, doc){
          e.preventDefault();
          
          var mode = $( "#modePortletLink").val(); //add o edit para agregar o modificar
          var id = $( "#idPortletLink").val(); //solo cuando es edición
          var type = "link"; //text, image, video, quote, link
          var title = null;
          var content = $('#contentLink').val();
          var author = null;//only used for quote type
          var url = $('#urlLink').val();//only used for image, video and link type
          var protocol = $('#protocol').val();
          
          if(content === ""){
            Bert.alert({message: 'El texto del enlace no puede estar vacío', type: 'danger', icon: 'fa fa-exclamation'});
          }
          else if(url===""){
            Bert.alert({message: 'La URL no puede estar vacía', type: 'danger', icon: 'fa fa-exclamation'});
          }
          else{

            var position = url.indexOf("http://");
            if(position>-1){
              url = url.substring(position+"http://".length,url.length);
            }
            else {
              position = url.indexOf("https://");
              if(position>-1){
                url = url.substring(position+"https://".length,url.length);
              }
            }

            url = protocol + url;

            if(mode==="edit"){
              Meteor.call(
                 'updatePortlet',
                 id,
                 title,
                 content,
                 author,
                 url
              );
              $( "#modePortletLink").val("add");
            }
            else if(mode==="add"){
              var portlet = Portlet.findOne({"projectID" : FlowRouter.getParam('id')},{sort: {'order': -1}});
              var order;
              if(portlet!=null){
                order = portlet.order + 1;
              }
              else{
                order = 1;
              }
              Meteor.call(
                 'insertPortlet',
                 FlowRouter.getParam('id'),
                 type,
                 title,
                 content,
                 author,
                 url,
                 order
              );
          }
          $('#linkModal').hide();
        }
      },
        
      'click .closeModal ': function (event){
        event.preventDefault();
        $('#myModal').hide();
        $('#textModal').hide();
        $('#imageModal').hide();
        $('#videoModal').hide();
        $('#quoteModal').hide();
        $('#linkModal').hide();
        $('#modalPortletText').hide();
        
      },
      'click #hideWizard' : function(event){
        event.preventDefault();
        
        Meteor.call('hideWizard');

        $('#myModal').hide();
      },
      'click #upload_widget' : function(){

          //$.cloudinary.cloudinary_upload_widget();

          $('#upload_widget').cloudinary_upload_widget({ cloudName: "drhowtsxb", uploadPreset: "ehg0n0xs" });

/*
          var myWidget = $.cloudinary.createUploadWidget({
            cloudName: 'drhowtsxb', 
            uploadPreset: 'ehg0n0xs'}, (error, rupload_widgetesult) => { 
              if (!error && result && result.event === "success") { 
                console.log('Done! Here is the image info: ', result.info); 
              }
            }
          )

         myWidget.open();*/
      },
      'click #openMediaGallery': function(event,template){
       event.preventDefault();
       $(".media-thumb").css('border','none');
       $("#setCoverPicture").addClass('disabled');
       $('#modal2').modal('show'); 
      },
      'change [type="file"]': function(e, t) {
        uploadFiles(e.target.files, FlowRouter.getParam('id'), 3);
      },
      'click #selectCoverPicture': function(event,template){
       event.preventDefault();
        var mediaId = $(event.currentTarget).attr("data-id");

        Session.set("mediaId",mediaId);

       $(".media-thumb").css('border','none');
       $(event.target).css('border', "solid 3px #ED1567");
       $("#setCoverPicture").removeClass('disabled');

      },
    'click #setCoverPicture': function(event,template){
       event.preventDefault();
       var mediaId = Session.get("mediaId");

       Meteor.call(
        'saveProjectPictureID',
        FlowRouter.getParam('id'),
        mediaId
      );

        $('#modal2').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $("#setCoverPicture").removeClass('disabled');

      },
   });

   Template.projectPage.onRendered(function () {
      console.log("Incrementando una vista");
      Meteor.call(
        'addOneView',
        FlowRouter.getParam("id")
        );
   });

   Template.selectedUsers.helpers({
      getCollabs(){
         var collabs = null;
         var proj = Project.findOne({'_id': FlowRouter.getParam('id')});
         if(proj){
            collabs = proj.project_staff;   
         }
         return collabs;
      }
   });

   Template.crew.helpers({
      getCrew(){
         var collabs = null;
         var proj = Project.findOne({"_id": FlowRouter.getParam('id')});
         if(proj){
            collabs = proj.project_staff;
         }

         

         return proj;
      },
      getPersonalURL(userId){
      var result = "";
      var user = Meteor.users.findOne({'_id':userId});
      if(user){
        result = "/profilePage";
      }
      return result;

    },
      profilePicture(userId){
         return Images.find({'owner': userId});
      },
      getProfilePicture(userId) {
        Meteor.subscribe("allMedia");
        var user = Meteor.users.findOne({'_id':userId});
        var url;
        if(user!=null && user.crew!=null && user.crew.profilePictureID!=null){
          var profile = Media.findOne({'mediaId':user.crew.profilePictureID});
          if(profile!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_100,h_100,c_thumb,r_max" + "/v" + profile.media_version + "/" + userId + "/" + user.crew.profilePictureID;    
          }
          
        }
        return url;
        
      },
      getInitials(userId){
        var name = "";
        var lastname = "";
        var initials = "";      
        var user = Meteor.users.findOne({'_id':userId});
        if(user){
          name = user.profile.name;
          lastname = user.profile.lastname;
          initials = name.charAt(0) + lastname.charAt(0);  
        }
        return initials;
      }
   });   

}


Template.cast.helpers({
      getCast(){
         var cast = null;
         var proj = Project.findOne({"_id": FlowRouter.getParam('id')});
         if(proj){
            cast = proj.project_cast;
         }
         return proj;
      },
      getPersonalURL(userId){
      var result = "";
      var user = Meteor.users.findOne({'_id':userId});
      if(user){
        result = "/profilePageActor";
      }
      return result;

    },
    getName(userId){
      var name = "";
      var user = Meteor.users.findOne({'_id':userId});
      if(user!=null && user.cast!=null){
        if(user.cast.showArtisticName){
          name = user.cast.artistic;
        }
        else{
          if(user.profile.name!=null && user.profile.name!=""){
            name = user.profile.name;  
          }
          if(user.profile.lastname!=null && user.profile.lastname!=""){
            name = name + " " + user.profile.lastname;
          }
          if(user.profile.lastname2!=null && user.profile.lastname2!=""){
            name = name + " " + user.profile.lastname2;
          }
        }
      }
      return name;
    },
    categories(userId){
      var strResult = "";
      var user = Meteor.users.findOne({'_id': userId});
      var result = new Array();
      
      if(user!=null && user.cast!=null && user.cast.categories!=null){
         result = user.cast.categories;
         for (var i = 0; i < result.length; i++) {
           strResult = strResult + ", " + result[i];
         }
         strResult = strResult.substring(2,strResult.length);
      }
      return strResult;      
   },
      profilePicture(userId){
         return Images.find({'owner': userId});
      },
      getProfilePicture(userId) {
        Meteor.subscribe("allMedia");
        var user = Meteor.users.findOne({'_id':userId});
        var url;
        if(user!=null && user.cast!=null && user.cast.profilePictureID!=null){
          var profile = Media.findOne({'mediaId':user.cast.profilePictureID});
          if(profile!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_100,h_100,c_thumb,r_max" + "/v" + profile.media_version + "/" + userId + "/" + user.cast.profilePictureID;    
          }
          
        }
        return url;
       
      },
      getInitials(userId){
        var name = "";
        var lastname = "";
        var initials = "";      
        var user = Meteor.users.findOne({'_id':userId});
        if(user){
          name = user.profile.name;
          lastname = user.profile.lastname;
          initials = name.charAt(0) + lastname.charAt(0);  
        }
        return initials;
      }
   });   




Template.companies.helpers({
      getCompanies(){
       var collabs = null;
       var proj = Project.findOne({"_id": FlowRouter.getParam('id')});
       if(proj){
          collabs = proj.companies;
       }
       return proj;
      },
      getCompanyName(companyId){
        var name;
        var company = Industry.findOne({'_id':companyId});
        if(company!=null){
          name = company.company_name;
        }
        return name;

      },
      getCompanyType(companyId){
        var type;
        var company = Industry.findOne({'_id':companyId});
        if(company!=null){
          type = company.company_type;
        }
        return type;
      },
      getLogoPicture(companyId, size) {
        Meteor.subscribe("allMedia");
        var data = Industry.findOne({'_id' : companyId});
        var url;
        if(data!=null && data.companyLogoID!=null){
          var cover = Media.findOne({'mediaId':data.companyLogoID});
          if(cover!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_fill" + "/v" + cover.media_version + "/" + data.userId + "/" + data.companyLogoID;    
          }
          
        }
        return url;
        /*
       var url = "";
       var company = Industry.findOne({'_id':companyId});
       if(company!=null && company.companyLogoID!=null && company.companyLogoID!=""){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_fill/" + company.companyLogoID;
       }
       return url;*/
      },
      getInitials(userId){
        var name = "";
        var lastname = "";
        var initials = "";      
        var user = Meteor.users.findOne({'_id':userId});
        if(user){
          name = user.profile.name;
          lastname = user.profile.lastname;
          initials = name.charAt(0) + lastname.charAt(0);  
        }
        return initials;
      }
   });   

