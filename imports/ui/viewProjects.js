import { Template } from 'meteor/templating';
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import './viewProjects.html';



Meteor.subscribe('myProjects');
Meteor.subscribe("userData");
//Meteor.subscribe("cover");

if (Meteor.isClient) {

   Template.projectList.helpers({
      myProjects(){      
         Meteor.subscribe('myProjects');
         return Project.find({'userId':FlowRouter.getParam('id'),'project_family':'P'}).fetch();
      },
      mySamples(){      
         Meteor.subscribe('myProjects');
         return Project.find({'userId':FlowRouter.getParam('id'),'project_family':'M'}).fetch();
      },
      isMainProject(value){
        var main = Project.findOne({'_id': value}).project_is_main;
        return (main === true) ? 'checked' : '' ; 
      },
      getProjectPicture(projectId) {
        Meteor.subscribe("allMedia");
        var data = Project.findOne({'_id' : projectId});
        var url;
        if(data!=null && data.projectPictureID!=null){
          var cover = Media.findOne({'mediaId':data.projectPictureID});
          if(cover!=null){
            //url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",c_fill" + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.projectPictureID;    
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "/v" + cover.media_version + "/" + Meteor.settings.public.LEVEL + "/" + data.projectPictureID;    
          }
          
        }
        return url;
        /*
          var url = "";
          var data = Project.findOne({'_id' : projectId});
          if(data!=null && data.projectPictureID!=null){
            url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.projectPictureID;
          }
         return url;*/
      },
      projectYear(projId){
       var proj = Project.findOne({'_id': projId});
       var result;
       if(proj!=null && proj.project_year!=null){
         result = proj.project_year;
       }
       else{
         result = "Año desconocido";
       }
       return result;
     },
      wizard(){
        if(Meteor.user()!=null && Meteor.user().wizard!=null){
          return Meteor.user().wizard;
        }

     }
   });

   Template.projectList.events({
      'change .proj_main': function(event, template) {
        /*Captura el id del proyecto*/
        current = event.currentTarget.value;

        /*Captura si es checked true o false*/
        check = event.currentTarget.checked;
        
         /*Poner todos los proyectos del usuario en falso*/
        userProjects = Project.find({userId: Meteor.userId()}).fetch();
        userProjects.forEach(function(current_value) {
                      Meteor.call(
                        'updateMain',
                        current_value._id,
                        false
                        );    
                    });
        /*Si el estatus seleccionado es checked poner este proyecto como principal*/
        if (check){
          Meteor.call(
            'updateMain',
            current,
            true
          );
        }      
      },
      'click .closeModal ': function (event){
        event.preventDefault();
        $('#myModal').hide();
      },
      'click #hideWizard' : function(event){
        event.preventDefault();
        
        Meteor.call('hideWizard');

        $('#myModal').hide();
      }
   });
}