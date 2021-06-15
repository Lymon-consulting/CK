import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { UsersIndex } from '/lib/common.js';
import { getParam } from '/lib/functions.js';
import { getRoleById } from '/lib/globals.js';
import { getCrewCategories } from '/lib/globals.js';
import { getCrewRoleFromCategory } from '/lib/globals.js';

import './searchCollaboratorForProject.html';
import '/lib/common.js';
import { sendAlert } from '../../lib/functions.js';

Template.searchCollaboratorForProject.rendered = function(){
  UsersIndex.getComponentMethods().addProps('isCrew', true);
  Session.set("selected_category",null);
}

Meteor.subscribe("otherUsers");
Template.searchCollaboratorForProject.helpers({
   usersIndex: () => UsersIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
       placeholder: 'Buscar', 
       id: 'searchBox'
     }; 
   },
   searchCount: () => {
    // index instanceof EasySearch.index
    let dict = UsersIndex.getComponentDict(/* optional name */);

    // get the total count of search results, useful when displaying additional information
    return dict.get('count')
   },
   getAllOcupations(){
    //return Ocupation.find({},{sort:{"secondary":1}}).fetch();
    let result = [];
    let categories = getCrewCategories();
    //console.log(categories);

    let allRoles = [];
    
    for(let i = 0; i<categories.length;i++){
      allRoles = getCrewRoleFromCategory(categories[i]);
      result.push("--- "+categories[i]+ " ---");
      for (let j=0; j<allRoles.length;j++) {
        
        result.push(allRoles[j].roleName);
      }
    }
    //console.log(result);
    return result;

  },
  isThisACategory(category){
    if(category.toString().indexOf("---")>=0){
      return true;
    }
    else{
      return false;
    }
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
getCategories(){
  var values = getCrewCategories();
  return values;
   /*var data = Ocupation.find({},{sort:{'title':1}}).fetch();
   return _.uniq(data, false, function(transaction) {return transaction.title});*/
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
getProjectName(){
  var project = Project.findOne({'_id': FlowRouter.getParam('id')});
  var name = "";
  if(project!=null){
    name = project.project_title;
  }
  return name;
},
getProjectID(){
  return FlowRouter.getParam('id');
},
checkParticipation(userId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': FlowRouter.getParam('id')});
    var result="";
    if(project){
      var staff = project.project_staff;
      if(staff!=null && staff!=""){
        for (var i = staff.length - 1; i >= 0; i--) {
          if(staff[i]._id === userId){
            result="checked";
            break;
          }
        }
      }

      if(userId === project.userId){
        result="checked";
      }
    }
    return result;
  },
  getRole(userId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': FlowRouter.getParam('id')});
    var result="";
    if(project){
      var staff = project.project_staff;
      if(staff!=null && staff!=""){
        for (var i = staff.length - 1; i >= 0; i--) {
          if(staff[i]._id === userId){
            result=staff[i].role;
            break;
          }
        }
      }
      if(userId === project.userId){
        result="Dueño del proyecto";
      }
    }
    return result;
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
    var url;
    var user = Meteor.users.findOne({'_id':userId});
    if(user!=null && user.profilePictureID!=null){
      var profile = Media.findOne({'mediaId':user.profilePictureID});
      if(profile!=null){
        url= Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + profile.media_version + "/" + Meteor.settings.public.LEVEL + "/" + user.profilePictureID;    
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
getCoverPicture(userId, size) {
 Meteor.subscribe("otherUsers");
 var url = "";
 var user = Meteor.users.findOne({'_id':userId});
 if(user!=null && user.crew!=null && user.crew.profileCoverID!=null && user.crew.profileCoverID!="undefined"){
  url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_scale/" + user.crew.profileCoverID;
}
return url;
}


});

Template.searchCollaboratorForProject.events({
 'click input': function(event) {
    if(event.target.checked){
      $("#sel_"+event.target.value).removeAttr('disabled');
      $("#but_"+event.target.value).removeAttr('disabled');
      $("#but_"+event.target.value).css('background','#ED1567');
    }
    else{
     //console.log("false");
     $("#sel_"+event.target.value).attr('disabled', 'disabled');
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

  var rol = $( "select#sel_"+e.target.value+" option:checked" ).val();
  var projectId = FlowRouter.getParam('id');

  var project = Project.findOne({'_id':projectId});

  var userId = e.target.value;

  var user = Meteor.users.findOne({'_id':userId});
  if(user){
    var email="";
    user.emails.forEach(function(element) {
      if(element.address != ""){ 
        email=element.address;
      }
    });

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
    console.log("el colaborador se va a armar con los datos siguientes:");

    var collaborator = {
      "_id" : user._id,
      "email": email,
      "role": rol,
      "name" : name,
      "confirmed": false, /*Cambiar esto para activar las notificaciones*/
      "invite_sent": false /*Cambiar esto para activar las notificaciones*/
    };
    console.log(collaborator);

    var exists = Project.find({$and:[{"_id":projectId},{ project_staff: {$elemMatch:{"email":email,"role":rol}}}]});
    if(exists.count()===0){
      console.log("SE va a agregar al colaborador en el proyecto "+projectId);

      Project.upsert(
       {'_id': projectId},
       { $push: { project_staff: collaborator }
     });

     const from = Meteor.userId();

     
     let message = `ha indicado que colaboraste en <a href='/projectPage/${projectId}'> 
      <strong class='text-black'>${project.project_title}</strong> </a> como ${rol} `;

     const alertId = sendAlert(from, userId, message, projectId, "P");

     console.log(alertId);

     /*

     Meteor.call(
      'addAlert',
      user._id,
      'Te han agregado como colaborador en un proyecto',
      from,
      4,
      projectId,
      null
      );   */

      $("#but_"+e.target.value).html('Invitación enviada');
      $("#but_"+e.target.value).attr('disabled', 'disabled');
      $("#sel_"+e.target.value).attr('disabled', 'disabled');
      $("#chk_"+e.target.value).attr('disabled', 'disabled');
      $("#rem_"+e.target.value).show();
    }
  }
},
 'click .remove_collaborator' : function(e, template, doc){
  e.preventDefault();
  var projectId = FlowRouter.getParam('id');
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
  if(confirm("¿Eliminar la colaboración de " + name + " de este proyecto?")){

      var email="";
      user.emails.forEach(function(element) {
        if(element.address != ""){ 
          email=element.address;
        }
      });


      var project = Project.findOne({'_id': projectId});
      var rol="";
      if(project){
        var staff = project.project_staff;
        if(staff!=null && staff!=""){
          for (var i = staff.length - 1; i >= 0; i--) {
            if(staff[i]._id === userId){
              rol=staff[i].role;
              break;
            }
          }
        }
      }

      var collaborator = {
       "email": email,
       "role": rol,
       "name" : name
     };

     Project.upsert(
      {'_id': projectId},
      { $pull: { project_staff: collaborator }
    });

     $("#but_"+e.target.value).html('Enviar invitación');
     $("#sel_"+e.target.value).prop('selectedIndex',0);
     $("#chk_"+e.target.value).prop( "checked", false );
     $("#chk_"+e.target.value).removeAttr('disabled');
     $("#rem_"+e.target.value).hide();
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

});

