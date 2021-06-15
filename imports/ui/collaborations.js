import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Project } from '../api/project.js';
import { Industry } from '../api/industry.js';
import { Media } from '../api/media.js';

import './collaborations.html'; 

Template.collaborations.helpers({
    getCollaborations(){
        Meteor.subscribe('allProjects');        
        const entityType = FlowRouter.getParam('entityType');
        const entityId = FlowRouter.getParam('entityID');
        let allCollaborationInProjects = [];
        let oneCollaboration = {};

        //entityType P = Project, entityType I = Industry
        if(entityType==="P"){
            const projectCollaboration = Project.find({"project_staff._id":  Meteor.userId()}).fetch();
            console.log(projectCollaboration);
            if(projectCollaboration){
                for (const collaboration of projectCollaboration) {
                    let arr = collaboration.project_staff;
                    arr.forEach(element => {
                       if(element._id===Meteor.userId()){
                            oneCollaboration = {
                                '_id': collaboration._id,
                                'project_title': collaboration.project_title,
                                'role':element.role,
                                'confirmed': element.confirmed
                            }
                          allCollaborationInProjects.push(oneCollaboration);
                       } 
                    });
                }
            }
            console.log(allCollaborationInProjects)
            return allCollaborationInProjects;
        }

        
    },
    getProjectImages(projId, size){
        Meteor.subscribe("allMedia");
          var data = Project.findOne({'_id' : projId});
          var url;
          if(data!=null && data.projectPictureID!=null){
            var cover = Media.findOne({'mediaId':data.projectPictureID});
            if(cover!=null){
              url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.projectPictureID;    
              console.log(url);
            }
            
          }
          return url;
       },
});

Template.collaborations.events({
    'click #yes': function(event, template){
        event.preventDefault();
        const entityId = $(event.currentTarget).attr("data-id");
        console.log(entityId);
        if(confirm('¿Aceptas haber participado en este proyecto?')){
            Meteor.call(
                'updateConfirmation',
                entityId,
                Meteor.userId(),
                true
                );
            
            Bert.alert({message: 'Has confirmado tu participación en el proyecto', type: 'sucess', icon: 'fa fa-check'});
        }
    },
    'click .no': function(event, template){
        event.preventDefault();
        const entityId = $(event.currentTarget).attr("data-id");
        console.log(entityId);
        if(confirm('¿Rechazas haber participado en este proyecto?')){
            Meteor.call(
                'deleteCollaboration',
                entityId,
                Meteor.userId()
                );
            
                Bert.alert({message: 'Has eliminado tu participación en el proyecto', type: 'sucess', icon: 'fa fa-check'});
               
        }
    }
});