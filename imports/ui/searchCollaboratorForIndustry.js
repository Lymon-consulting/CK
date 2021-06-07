import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Industry } from '../api/industry.js';
import { Media } from '../api/media.js';
import { UsersIndex } from '/lib/common.js';
import { getParam } from '/lib/functions.js';
import { getRoleById } from '/lib/globals.js';
import { getCrewCategories } from '/lib/globals.js';
import { getCrewRoleFromCategory } from '/lib/globals.js';

import './searchCollaboratorForIndustry.html';
import '/lib/common.js';

Template.searchCollaboratorForIndustry.rendered = function(){
  UsersIndex.getComponentMethods().addProps('isCrew', true);
  //UsersIndex.getComponentMethods().addProps('isCast', true);
  Session.set("selected_category",null);
}

Meteor.subscribe("otherUsers");
Template.searchCollaboratorForIndustry.helpers({
   usersIndex: () => UsersIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
       placeholder: 'Buscar', 
       id: 'searchBox'
     }; 
   },
   getAllOcupations(){
    return Ocupation.find({},{sort:{"secondary":1}}).fetch();
  },
  getAvailableYears(){
   var years = new Array();
    var MIN_YEAR = getParam("MIN_YEAR");
    var MAX_YEAR = getParam("MAX_YEAR");
    for(i=MAX_YEAR; i>MIN_YEAR; i--){
      years.push(i);
    }
    return years;
 },
 getCitiesFromCountries(){
  return City.find({'country': 'México'},{sort:{'city':1}}).fetch(); 
},
profilePicture(userId){
  return Images.find({'owner': userId});
},
notSameUser(userId){
  val = true;
  if(userId=== Meteor.userId()){
   val = false;
 }
 return val;
},
getCompanyName(){
  var company = Industry.findOne({'_id': FlowRouter.getParam('id')});
  var name = "";
  if(company!=null){
    name = company.company_name;
  }
  return name;
},
getCompanyID(){
  return FlowRouter.getParam('id');
},
checkParticipation(userId){
    var company = Industry.findOne({'_id': FlowRouter.getParam('id')});
    var result="";
    var staff;
    if(company){
      
      if(FlowRouter.getParam("type")==="crew"){
        staff = company.company_staff;
        if(staff!=null && staff!=""){
          for (var i = staff.length - 1; i >= 0; i--) {
            if(staff[i]._id === userId){
              result="checked";
              break;
            }
          }
        }  
      }
      else if(FlowRouter.getParam("type")==="industry"){
        staff = company.company_admin;
        if(staff!=null && staff!=""){
          for (var i = staff.length - 1; i >= 0; i--) {
            if(staff[i]._id === userId){
              result="checked";
              break;
            }
          }
        } 
      }
      


      if(userId === company.userId){
        result="checked";
      }
    }
    return result;
  },
  isCollaborator(userId){
    var company = Industry.findOne({'_id': FlowRouter.getParam('id')});
    var result="";
    var staff;
    if(company){
      if(FlowRouter.getParam("type")==="crew"){
        staff = company.company_staff;
        if(staff!=null && staff!=""){
          for (var i = staff.length - 1; i >= 0; i--) {
            if(staff[i]._id === userId){
              result=true;
              break;
            }
          }
        }
      }
      else if(FlowRouter.getParam("type")==="industry"){
        staff = company.company_admin;
        if(staff!=null && staff!=""){
          for (var i = staff.length - 1; i >= 0; i--) {
            if(staff[i]._id === userId){
              result=true;
              break;
            }
          }
        }
      }

      if(userId === company.userId){
        result=true;
      }
    }
    return result;
  },
/*   personalCover(userId){
      Meteor.subscribe("personalcover");
      return PersonalCover.find({'owner': userId});
    },*/
    showButtonFollow(follow){
      var following = Meteor.users.find({$and : [ {'_id' : Meteor.userId()} , {"follows": follow }]});

      var found = true;
      if(following.count() > 0){
       found = false;
     }
     return found;
   },
   getRoleSelected: function(value){
    var prole = "";
    if(Session.get("role_selected")!=null){
      prole = Session.get("role_selected");
    }
    else{
      prole = "cualquier";
    }
    return (prole === value) ? 'selected' : '' ;
  },
  getLocationSelected: function(value){
    var plocation = "";
    if(Session.get("location_selected")!=null){
      plocation = Session.get("location_selected");
    }
    else{
      plocation = "cualquier";
    }
    return (plocation === value) ? 'selected' : '' ;
  },
  getProfilePicture(userId, size) {
   Meteor.subscribe("allMedia");
    var user = Meteor.users.findOne({'_id':userId});
    if(user!=null && user.profilePictureID!=null){
      var profile = Media.findOne({'mediaId':user.profilePictureID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
      }

    }
},
getCategories(){
  var values = getCrewCategories();
  return values;
 },
 getOcupationsFromCategory(){
  //var allOcupations;
  var object = new Array();
  if(Session.get("selected_category")!=null){
    object = getCrewRoleFromCategory(Session.get("selected_category"));
    /*
    allOcupations = Ocupation.find({'title': Session.get("selected_category")}).fetch();
    if(Session.get("selected_category")==="Dirección"){
      allOcupations.push({'title':'Dirección', 'secondary':'Dirección'});
    }
    else if(Session.get("selected_category")==="Producción"){
      allOcupations.push({'title':'Producción', 'secondary':'Producción'});
    }*/
  }
  else{
    object = getCrewRoleFromCategory("Animación y arte digital");
    //allOcupations = Ocupation.find({'title': "Animacion y arte digital"}).fetch();
  }
  return object;
},
getCountries(){
 var data = City.find().fetch();
 return _.uniq(data, false, function(transaction) {return transaction.country});
},
getStatesFromCountries(){
  var country;
  if(Session.get("selected_country")!=null){
    country = City.find({'country': Session.get("selected_country")}).fetch();
    return _.uniq(country, false, function(transaction) {return transaction.state});
  }
  else{
   country = City.find({'country': 'México'}).fetch(); 
   return _.uniq(country, false, function(transaction) {return transaction.state});
 }

},
getCitiesFromStates(){
  if(Session.get("selected_state")!=null){
    return City.find({'state': Session.get("selected_state")}).fetch();
  }
  else{
    if(Meteor.user() && Meteor.user().state){
      return City.find({'state': Meteor.user().state}).fetch();    
    }
    else{
      return City.find({'state': 'Aguascalientes'}).fetch();    
    }
  }
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
getCoverPicture(userId, size) {
 Meteor.subscribe("otherUsers");
 var url = "";
 var user = Meteor.users.findOne({'_id':userId});
 if(user!=null && user.crew!=null && user.crew.profileCoverID!=null && user.crew.profileCoverID!="undefined"){
  url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_scale/" + user.crew.profileCoverID;
}
return url;
},
getRoleNames(role){
    var result = new Array();
    var strResult="";
    if(role){
      for (var i = 0; i < role.length; i++) {
        result.push(getRoleById(role[i]));
      }
      for (var i = 0; i < result.length; i++) {
        strResult = strResult + ", " + result[i].roleName;
      }
      strResult = strResult.substring(2, strResult.length);  
    }
    
    return strResult;
   },


});

Template.searchCollaboratorForIndustry.events({
 'click input': function(event) {
    if(event.target.checked){
      $("#but_"+event.target.value).removeAttr('disabled');
      $("#but_"+event.target.value).css('background','#ED1567');
    }
    else{
     //console.log("false");
     $("#but_"+event.target.value).attr('disabled', 'disabled');
     $("#but_"+event.target.value).css('background','#666');
   }
 },
 'click #pushFollow': function(event, template) {
  event.preventDefault();


      //console.log("Intentando seguir a "+ Session.get('userID'));
      var user = $("#thisUser").val();
      Meteor.users.update(
       {'_id': Meteor.userId()},
       { $push: { 'follows': user } }
       );

      $("#pushFollow").attr("disabled", true);
    },
    'click .pushCollaborator': function(event, template) {
      event.preventDefault();
      var user = event.target.id;
      Session.set("collaborator",user);
      FlowRouter.go('/addCollaborator');
    },
    'click #buscarBtn': function(event, template) {
      //event.preventDefault();
      console.log("Si entra");
      var e = jQuery.Event("keyup");
      e.keyCode = $.ui.keyCode.ENTER;
      $("#searchBox").trigger(e);

    },
    'change #location': function (e) {
      if($(e.target).val()!="cualquier"){
       UsersIndex.getComponentMethods().addProps('city', $(e.target).val());
       Session.set("location_selected",$(e.target).val());
     }
     else{
       UsersIndex.getComponentMethods().removeProps('city');  
       Session.set("role_selected",null);
     }
   },
   'change #role': function (e) {
    if($(e.target).val()!="cualquier"){
     UsersIndex.getComponentMethods().addProps('role', $(e.target).val());
     Session.set("role_selected",$(e.target).val());
   }
   else{
     UsersIndex.getComponentMethods().removeProps('role');  
     Session.set("role_selected",null);
   }
 },
 'click .add_collaborator' : function(e, template, doc){
  e.preventDefault();

  //var rol = $( "select#sel_"+e.target.value+" option:checked" ).val();
  var companyId = FlowRouter.getParam('id');
  
  var userId = e.target.value;

  var user = Meteor.users.findOne({'_id':userId});
  if(user){
    var email="";
    user.emails.forEach(function(element) {
      if(element.address != ""){ 
        email=element.address;
      }
    });
    
    //console.log("{$and:[{'_id':'"+companyId+"'},{ 'company_staff': {$elemMatch:{'email':'"+email+"'}}}]}");
    
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
    //console.log("el colaborador se va a armar con los datos siguientes:");

    var collaborator = {
      "_id" : user._id,
      "email": email,
      "name" : name,
      "confirmed": false, /*Cambiar esto para activar las notificaciones*/
      "invite_sent": false /*Cambiar esto para activar las notificaciones*/
    };
    //console.log(collaborator);

    var exists;

    console.log(FlowRouter.getParam("type"));
    
    if(FlowRouter.getParam("type")==="crew"){
      console.log("entra al type crew");
      exists = Industry.findOne({$and:[{"_id":companyId},{ 'company_staff': {$elemMatch:{"email":email}}}]});
      if(!exists){
        Industry.upsert(
          {'_id': companyId},
          { $push: { company_staff: collaborator }
        });  
      }
    }
    else if(FlowRouter.getParam("type")==="industry"){{
      console.log("entra al type industry");
      exists = Industry.findOne({$and:[{"_id":companyId},{ 'company_admin': {$elemMatch:{"email":email}}}]});
      if(!exists){
        Industry.upsert(
          {'_id': companyId},
          { $push: { company_admin: collaborator }
        });  
      }
    }
    
    //console.log("-->"+exists+"<--");
    
    $("#but_"+e.target.value).html('Invitación enviada');
    $("#but_"+e.target.value).attr('disabled', 'disabled');
    $("#chk_"+e.target.value).attr('disabled', 'disabled');
    $("#rem_"+e.target.value).show();
    
  }
 }
},
 'click .remove_collaborator' : function(e, template, doc){
  e.preventDefault();
  var companyId = FlowRouter.getParam('id');
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
       "email": email,
       "name" : name
     };
     if(FlowRouter.getParam("type")==="crew"){
        Industry.upsert(
          {'_id': companyId},
          { $pull: { company_staff: collaborator }
        }); 
     }
     else if(FlowRouter.getParam("type")==="industry"){
        Industry.upsert(
          {'_id': companyId},
          { $pull: { company_admin: collaborator }
        }); 
     }

     $("#but_"+e.target.value).html('Enviar invitación');
     $("#chk_"+e.target.value).prop( "checked", false );
     $("#chk_"+e.target.value).removeAttr('disabled');
     $("#rem_"+e.target.value).hide();
   }


 },
 'change #category':function(e, template){
 e.preventDefault();
 if($(e.target).val()!="cualquier"){
   Session.set("selected_category", $(e.target).val()); 
 }
 else{
   Session.set("selected_category", null);
   UsersIndex.getComponentMethods().removeProps('role');  
   Session.set("role_selected",null);
 }

},
'change #country': function (e) {
      Session.set("selected_country", e.target.value);
      if($(e.target).val()!="cualquier"){
       UsersIndex.getComponentMethods().addProps('country', $(e.target).val());
       Session.set("country_selected",$(e.target).val());
     }
     else{
       UsersIndex.getComponentMethods().removeProps('country');  
       UsersIndex.getComponentMethods().removeProps('state');  
       UsersIndex.getComponentMethods().removeProps('city'); 
       Session.set("country_selected",null);
     }
   },
   'change #state': function (e) {
    Session.set("selected_state", e.target.value);
    if($(e.target).val()!="cualquier"){
     UsersIndex.getComponentMethods().addProps('state', $(e.target).val());
     Session.set("state_selected",$(e.target).val());
   }
   else{
     UsersIndex.getComponentMethods().removeProps('state');  
     UsersIndex.getComponentMethods().removeProps('city'); 
     Session.set("state_selected",null);
   }
 },
 'change #city': function (e) {
  if($(e.target).val()!="cualquier"){
   UsersIndex.getComponentMethods().addProps('city', $(e.target).val());
   Session.set("city_selected",$(e.target).val());
 }
 else{
   UsersIndex.getComponentMethods().removeProps('city');  
   Session.set("city_selected",null);
 }
},

});

