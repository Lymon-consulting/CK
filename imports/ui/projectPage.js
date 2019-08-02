import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Portlet } from '../api/portlet.js';
import { Ocupation } from '../api/ocupations.js';

import './projectPage.html';
import '/lib/common.js';

if (Meteor.isClient) {
   Meteor.subscribe('projectData');
   Meteor.subscribe('otherUsers');
   Meteor.subscribe("images");
   Meteor.subscribe("myPortlets");

   Template.editor.rendered = function() {
     CKEDITOR.config.dialog_startupFocusTab = true;
     CKEDITOR.config.baseFloatZIndex = 9000;
     CKEDITOR.replace( 'content', {
       language: 'es',
       uiColor: '#CCCCCC'
     });
  }

  Template.items.rendered = function() {
    this.$('#items').sortable({
        stop: function(e, ui) {
          // get the dragged html element and the one before
          //   and after it
          el = ui.item.get(0);
          before = ui.item.prev().get(0);
          after = ui.item.next().get(0);
 
          // Here is the part that blew my mind!
          //  Blaze.getData takes as a parameter an html element
          //    and will return the data context that was bound when
          //    that html element was rendered!
          if(!before) {
            //if it was dragged into the first position grab the
            // next element's data context and subtract one from the rank
            newRank = Blaze.getData(after).order - 1;
          } else if(!after) {
            //if it was dragged into the last position grab the
            //  previous element's data context and add one to the rank
            newRank = Blaze.getData(before).order + 1;
          }
          else
            //else take the average of the two ranks of the previous
            // and next elements
            newRank = (Blaze.getData(after).order +
                       Blaze.getData(before).order)/2;
 
          //update the dragged Item's rank
          Portlet.update({'_id': Blaze.getData(el)._id}, {$set: {'order': newRank}});
        }
    });
  }

   Template.projectPage.helpers({
      projData(){
         return Project.findOne({'_id': FlowRouter.getParam('id')});
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
      ownerName(owner){
         
         var u = Meteor.users.findOne({'_id': owner}); 
         var fullName = "";
         if(u){
            fullName = u.profile.name + " " + u.profile.lastname;
            if(u.profile.lastname2!=null){
              fullName = fullName + " " + u.profile.lastname2;
            }
         }
         return fullName;
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
        Meteor.subscribe("userData");
       return Meteor.user().wizard;
     },
      getPortlets(){
        return Portlet.find({'projectID': FlowRouter.getParam('id')}, {
          sort: {'order': -1}
        }).fetch();
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
         var url = "";
         var user = Meteor.users.findOne({'_id':userId});
         if(user!=null && user.profilePictureID!=null && user.profilePictureID!=""){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_100,h_100,c_thumb,r_max/" + user.profilePictureID;
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

   Template.items.helpers({
      items() {
        return Portlet.find({'projectID': FlowRouter.getParam('id')}, {
                  sort: {'order': 1}
                }).fetch();
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
         
         //$("#pushLike").attr("disabled", true);
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
        'click #add_portlet': function(event,template,doc){
            /*
            $('#idPortlet').val("");
            $('#titlePortlet').val("");
            CKEDITOR.instances.content.setData("");
            $('#modePortlet').val("add");
            $('#windowPortlet').toggle(); */
            console.log("Dentro de la fucnión");
            $('#titlePortlet').val("");
            $('#comment').val("");
            $('#textModal').show();           
        },
        'click #savePortlet' : function(e, template, doc){
          e.preventDefault();
          /*
          var data = CKEDITOR.instances.content.getData();
          var title = $( "#titlePortlet").val();
          var mode = $( "#modePortlet").val();
          var id = $( "#idPortlet").val();*/
          var title = $( "#titlePortlet").val();
          var data = $('#msg').val();

          if(title === ""){
            Bert.alert({message: 'El título de la sección no puede estar vacío', type: 'error'});
          }
          else if(data===""){
            Bert.alert({message: 'El contenido de la sección no puede estar vacío', type: 'error'});
          }
          else{
            if(mode==="edit"){
              Meteor.call(
                 'updatePortlet',
                 id,
                 title,
                 data
              );
              $( "#modePortlet").val("add");
            }
            else if(mode==="add"){
              Meteor.call(
                 'insertPortlet',
                 FlowRouter.getParam('id'),
                 title,
                 data
              );
            }
             
             $('#windowPortlet').toggle(); 
            }
        },
        'click #edit_portlet' : function(e, template, doc){
          e.preventDefault();
          
          var id = $(e.target).attr('data-id');
          //var title = $(e.target).attr('data-title');
          //var content = $(e.target).attr('data-content');
          var mode = $(e.target).attr('mode');

          var portlet = Portlet.findOne({"_id":id});

          $('#titlePortlet').val(portlet.title);
          $('#modePortlet').val(mode);
          $('#idPortlet').val(id);
          CKEDITOR.instances.content.setData(portlet.content);
          $('#windowPortlet').toggle(); 
          window.scrollTo(0, 0);
        },
      'click .closeModal ': function (event){
        event.preventDefault();
        $('#myModal').hide();
        $('#textModal').hide();
        
      },
      'click #hideWizard' : function(event){
        event.preventDefault();
        
        Meteor.call('hideWizard');

        $('#myModal').hide();
      }
   });

   Template.projectPage.onRendered(function () {
      Project.update(
         {'_id': FlowRouter.getParam('id')},
         { $inc:{ 'views': 1}
      });
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
      profilePicture(userId){
         return Images.find({'owner': userId});
      },
      getProfilePicture(userId) {
       var url = "";
       var user = Meteor.users.findOne({'_id':userId});
       if(user!=null && user.profilePictureID!=null && user.profilePictureID!=""){
          url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_100,h_100,c_thumb,r_max/" + user.profilePictureID;
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


