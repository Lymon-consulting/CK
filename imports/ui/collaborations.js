import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Project } from '../api/project.js';
import { Industry } from '../api/industry.js';
import { Media } from '../api/media.js';
import { sendAlert } from '../../lib/functions.js';

import './collaborations.html'; 

Template.collaborations.helpers({
    getCollaborations(){
        Meteor.subscribe('allProjects');        
        const entityType = FlowRouter.getParam('entityType');
        const entityId = FlowRouter.getParam('entityID');
        let allCollaborationInProjects = [];
        let oneCollaboration = {};

        //entityType P = Project, entityType I = Industry
        //if(entityType==="P"){
            const projectCollaboration = Project.find({"project_staff.id":  Meteor.userId()}).fetch();
            console.log(projectCollaboration);
            if(projectCollaboration){
                for (const collaboration of projectCollaboration) {
                    let arr = collaboration.project_staff;
                    arr.forEach(element => {
                       if(element.id===Meteor.userId()){
                            oneCollaboration = {
                                'id': collaboration._id,
                                'project_title': collaboration.project_title,
                                'role':element.role,
                                'confirmed': element.confirmed
                            }
                          allCollaborationInProjects.push(oneCollaboration);
                       } 
                    });
                }
            }
            console.log(allCollaborationInProjects);
            return allCollaborationInProjects;
        //}

        
    },
    getIndustryCollaborations(){
        Meteor.subscribe('myIndustries');        
        const entityType = FlowRouter.getParam('entityType');
        const entityId = FlowRouter.getParam('entityID');
        let allCollaborationInIndustries = [];
        let oneCollaboration = {};

        //entityType P = Project, entityType I = Industry
        //if(entityType==="I"){
            const industryCollaboration = Industry.find({"company_staff.id":  Meteor.userId()}).fetch();
            console.log(industryCollaboration);
            if(industryCollaboration){
                for (const collaboration of industryCollaboration) {
                    let arr = collaboration.company_staff;
                    arr.forEach(element => {
                       if(element.id===Meteor.userId()){
                            oneCollaboration = {
                                'id': collaboration._id,
                                'email': Meteor.user().emails[0],
                                'name':Meteor.user().fullname,
                                'confirmed': element.confirmed,
                                'company_name': collaboration.company_name,
                                'companyLogoId': collaboration.companyLogoID
                            }
                          allCollaborationInIndustries.push(oneCollaboration);
                       } 
                    });
                }
            }
            console.log(allCollaborationInIndustries);
            return allCollaborationInIndustries;
        //}

        
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
    getIndustryImages(companyId, size){
        Meteor.subscribe("allMedia");
        var data = Industry.findOne({'_id' : companyId});
        var url;
        if(data!=null && data.companyLogoID!=null){
        var cover = Media.findOne({'mediaId':data.companyLogoID});
        if(cover!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.companyLogoID;    
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
        const entityType = FlowRouter.getParam('entityType');
        if(entityType==="P"){
            if(confirm('¿Aceptas haber participado en este proyecto?')){
                Meteor.call(
                    'updateConfirmation',
                    entityId,
                    Meteor.userId(),
                    true
                    );
                
                Bert.alert({message: 'Has confirmado tu participación en el proyecto', type: 'sucess', icon: 'fa fa-check'});
                /*Envío de alerta a quien generó la invitación */
                console.log(entityId);
                const project = Project.findOne({"_id":entityId});

                if(project){
                    console.log('Dentro');
                    const owner = project.userId;
                    const from = Meteor.userId();
                    console.log("De: "+from +" para:" + owner);
                    let message = `ha aceptado su colaboración en <a href='/projectPage/${entityId}'> 
                                <strong class='text-black'>${project.project_title}</strong> </a>`;

                    console.log(message);
                
                    const alertId = sendAlert(from, owner, message, entityId, "P", "collaborationAccepted");
                    console.log(alertId);
                }
            }
        }
        else if(entityType==="I"){
            if(confirm('¿Aceptas ser colaborador de esta organización?')){
                Meteor.call(
                    'updateCollaborationConfirmation',
                    entityId,
                    Meteor.userId(),
                    true
                    );
                
                Bert.alert({message: 'Has confirmado tu colaboración', type: 'sucess', icon: 'fa fa-check'});
                /*Envío de alerta a quien generó la invitación */
                console.log(entityId);
                const company = Industry.findOne({"_id":entityId});

                if(company){
                    const owner = company.userId;
                    const from = Meteor.userId();
                    console.log("De: "+ from +" para:" + owner);
                    let message = `ha aceptado su colaboración en <a href='/industryPage/${entityId}'> 
                                <strong class='text-black'>${company.company_name}</strong> </a>`;

                    console.log(message);
                
                    const alertId = sendAlert(from, owner, message, entityId, "I", "collaborationAccepted");
                    console.log(alertId);
                }
            }
        }
    },
    'click .no': function(event, template){
        event.preventDefault();
        const entityId = $(event.currentTarget).attr("data-id");
        console.log(entityId);
        const entityType = FlowRouter.getParam('entityType');
        if(entityType==="P"){
            if(confirm('¿Rechazas haber participado en este proyecto?')){
                
                Meteor.call(
                    'deleteCollaboration',
                    entityId,
                    Meteor.userId()
                    );
                
                Bert.alert({message: 'Has eliminado tu participación en el proyecto', type: 'sucess', icon: 'fa fa-check'});
                
                /*Envío de alerta a quien generó la invitación */
                const project = Project.findOne({"_id":entityId});
                if(project){
                    const owner = project.userId;
                    const from = Meteor.userId();
                    let message = `ha rechazado su colaboración en <a href='/projectPage/${entityId}'> 
                                <strong class='text-black'>${project.project_title}</strong> </a>`;
                
                    const alertId = sendAlert(from, owner, message, entityId, "P", "collaborationRejected");
                    console.log(alertId);
                }
                
            }
        }
        else if(entityType==="I"){
            if(confirm('¿Rechazas ser colaborador o colaboradora de esta organización?')){

                var industry = Industry.findOne({'_id': entityId});
                let arrayElement = {};
                if(industry){
                    var staff = industry.company_staff;
                    if(staff!=null && staff!=""){
                        for (var i = staff.length - 1; i >= 0; i--) {
                            if(staff[i].id === Meteor.userId()){
                            arrayElement = staff[i];
                            break;
                            }
                        }
                    }
                }

                console.log(arrayElement);

                Meteor.call(
                    'deleteCollaborationIndustry',
                    entityId,
                    arrayElement.id,
                    arrayElement.email, //Meteor.user().emails[0].address,
                    arrayElement.name,
                    arrayElement.confirmed,
                    arrayElement.invite_sent
                    );
                
                Bert.alert({message: 'Has eliminado tu colaboración', type: 'sucess', icon: 'fa fa-check'});
                
                /*Envío de alerta a quien generó la invitación */
                const company = Industry.findOne({"_id": entityId});
                if(company){
                    const owner = company.userId;
                    const from = Meteor.userId();
                    let message = `ha rechazado su colaboración en <a href='/industryPage/${entityId}'> 
                                <strong class='text-black'>${company.company_name}</strong> </a>`;
                
                    const alertId = sendAlert(from, owner, message, entityId, "I", "collaborationRejected");
                    console.log(alertId);
                }
                
            }
        }
    }
});