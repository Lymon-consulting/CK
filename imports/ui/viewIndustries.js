import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { Media } from '../api/media.js';
import './viewIndustries.html';

Meteor.subscribe('myIndustries');

Template.industryList.helpers({
  myIndustries(){      
   Meteor.subscribe('myIndustries');
   var ownerOfCompanies = new Array();
   var adminOfCompanies = new Array();
   var result = new Array();
   ownerOfCompanies = Industry.find({'userId':FlowRouter.getParam('id')}).fetch();
   adminOfCompanies = Industry.find({'company_admin._id': FlowRouter.getParam('id')}).fetch();
   for (var i = 0; i < ownerOfCompanies.length; i++) {
     result.push(ownerOfCompanies[i]);
   }
   for (var i = 0; i < adminOfCompanies.length; i++) {
     adminOfCompanies[i].admin=true;
     result.push(adminOfCompanies[i]);
   }
   return result;
  },
  getCompanyLogo(companyId, size) {
    Meteor.subscribe("allMedia");
    var data = Industry.findOne({'_id' : companyId});
    var url;
    if(data!=null && data.companyLogoID!=null){
      var cover = Media.findOne({'mediaId':data.companyLogoID});
      if(cover!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_250,c_scale" + "/v" + cover.media_version + "/" + data.userId + "/" + data.companyLogoID;    
      }
      
    }
    return url;
  },
  ownerOfIndustry(userId){
    if(userId===FlowRouter.getParam("id")){
      return true;
    }
    else{
      return false;
    }
  },
  showAdmins(){
    var result = new Array();
    if(Session.get("admins")){
      result = Session.get("admins");
    }
    return result;
  },
  getProfilePicture(userId, size) {
    Meteor.subscribe("allMedia");
    var user = Meteor.users.findOne({'_id':userId});
    var url;
    if(user!=null && user.profilePictureID!=null){
      var profile = Media.findOne({'mediaId':user.profilePictureID});
      if(profile!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.profilePictureID;    
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
  },
});

Template.industryList.events({
  'click .editIndustry':function(event, template){
    var companyID = $(event.target).attr('data-answer');
    console.log(companyID);
    //Session.set("companyID",companyID);
    FlowRouter.go("/editIndustry/"+companyID);
  },
  'click .opendiag':function(event,template){
     event.preventDefault();
     var companyID = $(event.target).attr('data-answer');
     var data = Industry.findOne({'_id' : companyID});
     var result = data.company_admin;
     Session.set("admins",result);
     Session.set("companyID",companyID);
     $('#adminModal').modal('toggle');
     $('#adminModal').modal('show');
  },
  'click #cancel':function(event,template){
    event.preventDefault();
    $('#adminModal').modal('toggle');
    $('#adminModal').modal('hide');
  },
  'click .remove_collaborator' : function(e, template, doc){
    e.preventDefault();
    var companyId = Session.get("companyID");
    var userId = e.target.value;
    var user = Meteor.users.findOne({'_id': userId});
    var name="";
    if(user.profile.name!=null && user.profile.name!=""){
      name = user.profile.name;  
    }
    if(user.profile.lastname!=null && user.profile.lastname!=""){
      name = name + " " + user.profile.lastname;
    }
    if(user.profile.lastname2!=null && user.profile.lastname2!=""){
      name = name + " " + user.profile.lastname2;
    }
    if(confirm("¿Eliminar la colaboración de " + name + " de esta empresa?")){

        var email="";
        user.emails.forEach(function(element) {
          if(element.address != ""){ 
            email=element.address;
          }
        });

        var collaborator = {
         "_id": userId,
         "email": email,
         "name" : name
       };
       
        Industry.upsert(
          {'_id': companyId},
          { $pull: { company_admin: collaborator }
        }); 
     }
     $('#adminModal').modal('toggle');
    $('#adminModal').modal('hide');
   },
});